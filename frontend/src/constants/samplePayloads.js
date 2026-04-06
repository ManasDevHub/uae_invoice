export const SAMPLES = {
  b2b: {
    label: 'Valid B2B',
    color: 'text-emerald-400',
    payload: {
      invoice_number: "INV-B2B-001",
      invoice_date: "2026-04-01",
      invoice_type_code: "380",
      payment_means_type_code: "10",
      transaction_type: "B2B",
      currency_code: "AED",
      tax_category_code: "S",
      seller: { seller_name: "Tech Corp LLC", seller_trn: "100200300400500", address: "Dubai, UAE", country_code: "AE" },
      buyer:  { buyer_name: "Client Group FZE", buyer_trn: "100999888777666", address: "Abu Dhabi, UAE", country_code: "AE" },
      lines: [{
        line_id: "1", item_name: "Consulting Services",
        unit_of_measure: "EA", quantity: 10,
        unit_price: 500, line_net_amount: 5000,
        tax_category: "S", tax_rate: 0.05, tax_amount: 250
      }],
      totals: { total_without_tax: 5000, tax_amount: 250, total_with_tax: 5250, amount_due: 5250 }
    }
  },
  b2c: {
    label: 'Valid B2C',
    color: 'text-sky-400',
    payload: {
      invoice_number: "INV-B2C-001",
      invoice_date: "2026-04-01",
      invoice_type_code: "380",
      payment_means_type_code: "30",
      transaction_type: "B2C",
      currency_code: "AED",
      tax_category_code: "S",
      seller: { seller_name: "Tech Corp LLC", seller_trn: "100200300400500", address: "Dubai, UAE", country_code: "AE" },
      buyer:  { buyer_name: "Individual Customer", address: "Sharjah, UAE", country_code: "AE" },
      lines: [{
        line_id: "1", item_name: "Product Sale",
        unit_of_measure: "EA", quantity: 2,
        unit_price: 100, line_net_amount: 200,
        tax_category: "S", tax_rate: 0.05, tax_amount: 10
      }],
      totals: { total_without_tax: 200, tax_amount: 10, total_with_tax: 210, amount_due: 210 }
    }
  },
  creditNote: {
    label: 'Credit Note',
    color: 'text-violet-400',
    payload: {
      invoice_number: "CN-001",
      invoice_date: "2026-04-01",
      invoice_type_code: "381",
      payment_means_type_code: "10",
      transaction_type: "B2B",
      currency_code: "AED",
      tax_category_code: "S",
      seller: { seller_name: "Tech Corp LLC", seller_trn: "100200300400500", address: "Dubai, UAE", country_code: "AE" },
      buyer:  { buyer_name: "Client Group FZE", buyer_trn: "100999888777666", address: "Abu Dhabi, UAE", country_code: "AE" },
      lines: [{
        line_id: "1", item_name: "Return — Consulting",
        unit_of_measure: "EA", quantity: -5,
        unit_price: 500, line_net_amount: -2500,
        tax_category: "S", tax_rate: 0.05, tax_amount: -125
      }],
      totals: { total_without_tax: -2500, tax_amount: -125, total_with_tax: -2625, amount_due: -2625 }
    }
  },
  negative: {
    label: 'Negative (E4/E10/E11)',
    color: 'text-red-400',
    payload: {
      invoice_number: "INV-FAIL-001",
      invoice_date: "2026-04-01",
      invoice_type_code: "380",
      payment_means_type_code: "999",
      transaction_type: "B2B",
      currency_code: "AED",
      tax_category_code: "X",
      seller: { seller_name: "Bad Corp", seller_trn: "12345", address: "Dubai, UAE", country_code: "US" },
      buyer:  { buyer_name: "Client", buyer_trn: "100999888777666", country_code: "AE" },
      lines: [{
        line_id: "1", item_name: "Item",
        unit_of_measure: "INVALID", quantity: -5,
        unit_price: 100, line_net_amount: 100,
        tax_category: "S", tax_rate: 0.05, tax_amount: 99
      }],
      totals: { total_without_tax: 100, tax_amount: 5, total_with_tax: 999, amount_due: 105 }
    }
  }
}

export const DEMO_API_KEY = 'demo-key-123'
