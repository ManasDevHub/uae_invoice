from typing import Dict, Any
from app.adapters.base import BaseERPAdapter
from app.models.invoice import InvoicePayload

class GenericJSONAdapter(BaseERPAdapter):
    """
    Adapter that handles the Generic JSON structure for the POC.
    In an enterprise SaaS, there would be subclasses like OracleIDOCAdapter or SAPJsonAdapter.
    """
    def transform(self, raw_data: Dict[str, Any]) -> InvoicePayload:
        """
        Final robust transformation logic to bridge ERP/Excel datasets to PINT AE schema.
        Handles: Fuzzy mapping, float-to-string TRN cleanup, and auto-nesting.
        """
        import re
        data_copy = raw_data.copy()
        
        # 1. FUZZY COLUMN MAPPING (Handles ERP/Excel variations)
        # Normalize keys first (stripping spaces, lowercase)
        norm_data = {str(k).lower().replace(" ", "_"): v for k, v in data_copy.items()}
        
        alias_map = {
            "invoiced_item_tax_category": "tax_category",
            "vat_category": "tax_category",
            "vat_rate": "tax_rate",
            "item_description": "item_name",
            "total_inc_vat": "total_with_tax",
            "total_excl_vat": "total_without_tax",
            "net_amount": "line_net_amount"
        }
        
        # Apply aliases back to data_copy if they are missing
        for alias, target in alias_map.items():
            if alias in norm_data and target not in norm_data:
                norm_data[target] = norm_data[alias]

        # 2. NUMERIC CLEANUP (Fix for Excel "349...422.0" and "TEST" issues)
        def safe_float(val: Any, default: float = 0.0) -> float:
            if val is None or val == "": return default
            try:
                # Handle cases where Excel might have strings like '1,234.56'
                if isinstance(val, str):
                    val = val.replace(',', '').strip()
                return float(val)
            except (ValueError, TypeError):
                print(f"--- [ADAPTER] Warning: Could not convert '{val}' to float. Defaulting to {default}. ---")
                return default

        def cleanup_excel_number(val: Any) -> Any:
            if val is None: return val
            s_val = str(val).strip()
            if s_val.endswith(".0"): s_val = s_val[:-2]
            return s_val

        # 3. MAP SELLER (Nesting + Cleanup)
        if not isinstance(norm_data.get("seller"), dict):
            seller_trn = cleanup_excel_number(norm_data.get("seller_trn", norm_data.get("trn", "")))
            norm_data["seller"] = {
                "seller_name": str(norm_data.get("seller_name", norm_data.get("seller", "Seller LLC"))),
                "seller_trn": seller_trn if len(seller_trn) >= 15 else None,
                "address": str(norm_data.get("seller_address", "Business Bay")),
                "city": str(norm_data.get("seller_city", "Dubai")),
                "subdivision": str(norm_data.get("seller_subdivision", norm_data.get("seller_emirate", "DU"))).upper(),
                "country_code": str(norm_data.get("seller_country_code", "AE")),
                "electronic_address": str(norm_data.get("seller_electronic_address", seller_trn)),
                "electronic_scheme": str(norm_data.get("seller_electronic_scheme", "0235"))
            }

        # 4. MAP BUYER (Nesting + Cleanup)
        if not isinstance(norm_data.get("buyer"), dict):
            buyer_trn = cleanup_excel_number(norm_data.get("buyer_trn", ""))
            norm_data["buyer"] = {
                "buyer_name": str(norm_data.get("buyer_name", norm_data.get("buyer_group", "Buyer Entity"))),
                "buyer_trn": buyer_trn if buyer_trn else None,
                "address": str(norm_data.get("buyer_address", "Downtown")),
                "city": str(norm_data.get("buyer_city", "Dubai")),
                "subdivision": str(norm_data.get("buyer_subdivision", norm_data.get("buyer_emirate", "DU"))).upper(),
                "country_code": str(norm_data.get("buyer_country_code", "AE")),
                "electronic_address": str(norm_data.get("buyer_electronic_address", buyer_trn if buyer_trn else "CONSUMER")),
                "electronic_scheme": str(norm_data.get("buyer_electronic_scheme", "0235"))
            }
            
        # Infer B2C if buyer TRN is missing
        if not norm_data.get("buyer", {}).get("buyer_trn"):
            norm_data["transaction_type"] = "B2C"


        # 5. MAP TOTALS (Nesting + Conversion with safe_float)
        existing_totals = norm_data.get("totals", {}) if isinstance(norm_data.get("totals"), dict) else {}
        total_without_tax = safe_float(existing_totals.get("total_without_tax", norm_data.get("total_without_tax", norm_data.get("subtotal", 0))))
        norm_data["totals"] = {
            "line_extension_amount": safe_float(existing_totals.get("line_extension_amount", total_without_tax)),
            "total_without_tax": total_without_tax,
            "tax_amount": safe_float(existing_totals.get("tax_amount", norm_data.get("tax_amount", norm_data.get("vat_amount", 0)))),
            "total_with_tax": safe_float(existing_totals.get("total_with_tax", norm_data.get("total_with_tax", norm_data.get("total", 0)))),
            "amount_due": safe_float(existing_totals.get("amount_due", norm_data.get("amount_due", norm_data.get("total", 0))))
        }

        # 6. MAP LINES (Nesting line_N_... data with safe_float)
        if not norm_data.get("lines") or not isinstance(norm_data["lines"], list):
            lines = []
            for i in range(1, 11):
                prefix = f"line_{i}_"
                if norm_data.get(f"{prefix}quantity") or norm_data.get(f"{prefix}item_name") or norm_data.get(f"{prefix}unit_price"):
                    qty = safe_float(norm_data.get(f"{prefix}quantity", 0))
                    price = safe_float(norm_data.get(f"{prefix}unit_price", 0))
                    rate = safe_float(norm_data.get(f"{prefix}tax_rate", norm_data.get("tax_rate", 0.05)), default=0.05)
                    lines.append({
                        "line_id": str(i),
                        "item_name": str(norm_data.get(f"{prefix}item_name", f"Item {i}")),
                        "item_description": str(norm_data.get(f"{prefix}description", f"Description {i}")),
                        "quantity": qty,
                        "unit_price": price,
                        "gross_price": safe_float(norm_data.get(f"{prefix}gross_price", price)),
                        "price_base_quantity": safe_float(norm_data.get(f"{prefix}base_qty", 1.0), default=1.0),
                        "line_net_amount": safe_float(norm_data.get(f"{prefix}line_net_amount", qty * price)),
                        "tax_category": str(norm_data.get(f"{prefix}tax_category", norm_data.get("tax_category", "S"))),
                        "tax_rate": rate,
                        "tax_amount": safe_float(norm_data.get(f"{prefix}tax_amount", (qty * price) * rate))
                    })
            
            # Single line fallback
            if not lines and (norm_data.get("quantity") or norm_data.get("item_name")):
                qty = safe_float(norm_data.get("quantity", 0))
                price = safe_float(norm_data.get("unit_price", 0))
                rate = safe_float(norm_data.get("tax_rate", 0.05), default=0.05)
                lines.append({
                    "line_id": "1",
                    "item_name": str(norm_data.get("item_name", "Standard Service")),
                    "item_description": str(norm_data.get("item_description", "Service Description")),
                    "quantity": qty,
                    "unit_price": price,
                    "gross_price": safe_float(norm_data.get("gross_price", price)),
                    "price_base_quantity": 1.0,
                    "line_net_amount": safe_float(norm_data.get("line_net_amount", qty * price)),
                    "tax_category": str(norm_data.get("tax_category", "S")),
                    "tax_rate": rate,
                    "tax_amount": safe_float(norm_data.get("tax_amount", (qty * price) * rate))
                })
            norm_data["lines"] = lines

        # 7. FINAL TYPE CORRECTION (invoice_type_code resilient handling)
        if norm_data.get("invoice_type_code"):
            try:
                norm_data["invoice_type_code"] = str(int(float(norm_data["invoice_type_code"])))
            except (ValueError, TypeError):
                norm_data["invoice_type_code"] = "380"
        else:
            norm_data["invoice_type_code"] = "380"

        # PINT AE Defaults
        if "specification_id" not in norm_data:
            norm_data["specification_id"] = "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:01:1.0"
        if "business_process_id" not in norm_data:
            norm_data["business_process_id"] = "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0"

        # 8. Generate Tax Subtotals if missing (A5 Compliance)
        if not norm_data.get("tax_subtotals"):
            tax_map = {}
            for line in norm_data.get("lines", []):
                cat = line.get("tax_category", "S")
                rate = line.get("tax_rate", 0.05)
                key = f"{cat}_{rate}"
                if key not in tax_map:
                    tax_map[key] = {
                        "tax_category_code": cat,
                        "tax_rate": rate,
                        "taxable_amount": 0.0,
                        "tax_amount": 0.0
                    }
                tax_map[key]["taxable_amount"] += float(line.get("line_net_amount", 0.0))
                tax_map[key]["tax_amount"] += float(line.get("tax_amount", 0.0))
            
            norm_data["tax_subtotals"] = list(tax_map.values())

        print(f"--- [ADAPTER] Transformation Complete for PINT AE (51 Fields). ---")
        return InvoicePayload(**norm_data)
