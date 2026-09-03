# Advertising UTM Standard

Use lowercase ASCII values with underscores between words. Keep campaign names stable across platforms so performance can be compared without manual cleanup.

## Naming Rules

| Field | Rule | Examples |
|---|---|---|
| `utm_source` | Advertising platform | `facebook`, `instagram`, `google`, `youtube` |
| `utm_medium` | Paid channel type | `paid_social`, `cpc`, `paid_video` |
| `utm_campaign` | `market_objective_product_period` | `us_leads_pet_pads_2026q3` |
| `utm_content` | Placement and creative identifier | `reels_factory_v1`, `search_oem_exact`, `demandgen_sample_v2` |
| `utm_term` | Audience, keyword, or ad-group identifier | `pet_brand_owners`, `oem_pet_pad_manufacturer`, `custom_intent_pet_buyers` |

Do not put names, emails, phone numbers, customer lists, or other personal information into UTM values.

## Link Examples

Facebook Reels:

```text
https://www.jczcare.com/request-product-plan?utm_source=facebook&utm_medium=paid_social&utm_campaign=us_leads_pet_pads_2026q3&utm_content=reels_factory_v1&utm_term=pet_brand_owners
```

Instagram Reels:

```text
https://www.jczcare.com/request-product-plan?utm_source=instagram&utm_medium=paid_social&utm_campaign=us_leads_pet_pads_2026q3&utm_content=reels_sample_v1&utm_term=private_label_buyers
```

Google Search:

```text
https://www.jczcare.com/request-product-plan?utm_source=google&utm_medium=cpc&utm_campaign=us_leads_pet_pads_2026q3&utm_content=search_oem_exact&utm_term=oem_pet_pad_manufacturer
```

YouTube Demand Gen:

```text
https://www.jczcare.com/request-product-plan?utm_source=youtube&utm_medium=paid_video&utm_campaign=us_leads_pet_pads_2026q3&utm_content=demandgen_factory_v1&utm_term=custom_intent_pet_buyers
```

Meta and Google append `fbclid` or `gclid` automatically when click-ID tagging is enabled. Do not create these values manually.
