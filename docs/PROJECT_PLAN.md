# HOTEL MATE — Marketing Panel (Project Plan & Assessment Flow)

> **Next.js marketing panel for Hotel Mate** — monitor social media leads, manage sales (client closing), client onboarding & property assessment, and follow-ups.
> Facebook සහ Instagram හරහා එන Leads ලබාගැනීම, WhatsApp පණිවිඩ මඟින් Assessment Form යැවීම, සහ හෝටලයේ Capacity & Category අනුව හොඳම Package එක සහ Demo එක සූදානම් කිරීමේ සම්පූර්ණ පද්ධතිය.

---

## 1. Project Scan (ව්‍යාපෘතික ස්කෑන් එක)

| අංගය | සොයාගත් දේ |
|---|---|
| Repository | `hotelmatedigital-wq/hotelmatemarketing` |
| Reference site | [hotelmate.co.uk](https://www.hotelmate.co.uk/) — Brand colors & UI guidelines |
| Brand colors (extracted) | **Primary `#00AEEF`** (Cerulean) · **Dark `#0C1E21`** (Firefly) · **Neutral `#E5E5E5`** (Mercury) |
| Framework | Next.js 16 (App Router, TypeScript, Tailwind CSS v4) |
| Owner contact | **+94 78 860 7143** (wired into sidebar, footer & WhatsApp actions) |

---

## 2. What's Built (දැනට නිම කර ඇති විශේෂාංග)

### 🚀 A. Dedicated FB & IG Lead Generator (`/generator`)
- Facebook Lead Forms, Instagram Ads, Messenger සහ Direct Inquiries මඟින් ලැබෙන Client ගේ:
  - **Name**
  - **Mobile / WhatsApp Number**
  - **Email Address**
  - Acquisition Channel (FB / IG / WhatsApp)
  - Campaign / Ad Name & Initial Notes
- ඇතුළත් කළ වහාම:
  1. Client සඳහා වෙන්වූ **Personalized Assessment Link** එකක් auto-generate වේ (e.g. `/intake?leadId=L-1044`).
  2. **WhatsApp Message එක ස්වයංක්‍රීයව Pre-fill වී** සකස් වේ.
  3. **"Open WhatsApp & Review Message"** බොත්තම Click කළ සැනින් WhatsApp Web හෝ App එකේ message එක review කර යැවීමට විවෘත වේ.
  4. Recent FB/IG leads ලැයිස්තුවෙහි Form එක සම්පූර්ණ කර ඇත්ද (Submitted vs Pending) ක්ෂණිකව බලාගත හැක.

### 📝 B. Client Onboarding & Assessment Form (`/intake`)
Client වෙත WhatsApp හරහා යවන පෝරමය. Mobile-friendly වන අතර Client ගේ නම, දුරකථන අංකය සහ ඊමේල් ලිපිනය auto pre-fill වේ.

**පෝරමයේ අඩංගු අංග (Exact Form Fields):**
1. **Name** (Client Name)
2. **Business Name** (Hotel / Property Name)
3. **Business Area** (City / Region)
4. **Mobile Number** (WhatsApp)
5. **Email Address**
6. **Hotel Category** [Dropdown: Boutique Hotel, Lodge, Villa, Cabana, Hostel, Guest House, 3 Star, 4 Star, 5 Star, 7 Star]
7. **Number of Rooms** (Capacity)
8. **Restaurant** [Yes / No]
9. **Spa** [Yes / No]
10. **Have you used a Hotel Management System before?** [Yes / No]
11. **Are you currently using a Hotel Management System?** [Yes / No]
12. **Have you used a Channel Manager before?** [Yes / No]
13. **Are you currently using a Channel Manager?** [Yes / No]
14. **OTAs Currently Managed** [Checkboxes: booking.com, Agoda, Airbnb, Expedia, Other (+ specify)]
15. **How did you find out about us?** [Dropdown: Social Media, Recommendation, Other (+ specify)]
16. **Demo Time AND Date** (Client ගේ කැමැත්ත පරිදි Demo දිනය සහ වේලාව)

### 💡 C. Client Assessment & Intelligent Package Recommendation (Panel එක තුළ)
Client පෝරමය submit කළ පසු, panel එක තුළ Lead Profile (`/leads/[id]`):
- **Property Capacity & Facilities**: කාමර ගණන, Category එක, Restaurant සහ Spa පහසුකම් විග්‍රහ කරයි.
- **Software Background & OTAs**: භාවිතා කරන OTAs සහ පෙර මෘදුකාංග අත්දැකීම් පෙන්වයි.
- **Client Requested Demo Time**: දිනය සහ වේලාව විශේෂයෙන් ඉස්මතු කර පෙන්වයි.
- **Intelligent Package Recommendation**:
  - හෝටලයේ පරිමාණයට ගැලපෙන Package එක (Starter / Professional / Enterprise) සහ ඇස්තමේන්තුගත මාසික මිල (LKR/mo).
  - අවශ්‍ය Add-ons (Restaurant POS, Spa Module, 2-Way OTA Channel Manager, Housekeeping App).
  - **Communication Approach & Key Pitch Points**: Client කතා කරන විට Sales Agent හට ඉදිරිපත් කළ යුතු වැදගත්ම කරුණු (උදා: දැනට Channel Manager එකක් නැතිව booking.com/Agoda කරන අයට Overbooking වැළැක්වීමේ pitch එක).

### 💬 D. Pre-Filled WhatsApp Outreach Message Template
```text
Thank you for contacting Hotel Mate! 👋

Hi [Client Name], we are excited to connect with you regarding your property.

To help us understand your requirements and arrange a personalized demo for you, please take 2 minutes to fill out this quick form:

👉 https://marketing.hotelmate.app/intake?leadId=[LEAD_ID]

Once you submit the details, our team will review your hotel's capacity and confirm your preferred demo time.

Best regards,
Hotel Mate Team
All-in-One · Integrated · AI Powered Hotel Management
Hotline: +94 78 860 7143
```

---

## 3. System Architecture & Routes (ගොඩනැගිල්ල)

```
hotelmatemarketing/
├── app/
│   ├── layout.tsx                     # Root HTML & styling
│   ├── globals.css                    # Tailwind CSS v4 (@theme brand/ink/mist)
│   ├── intake/                        # Public Client Assessment Form
│   │   ├── page.tsx
│   │   └── IntakeForm.tsx             # 16-field onboarding & demo form
│   ├── api/
│   │   ├── leads/route.ts             # Leads collection API (GET, POST)
│   │   └── intake/route.ts            # Client form submission & prefill API
│   └── (panel)/                       # Protected marketing panel shell
│       ├── layout.tsx
│       ├── page.tsx                   # Marketing Dashboard
│       ├── generator/
│       │   ├── page.tsx
│       │   └── GeneratorClient.tsx    # FB & IG Lead Generator & WhatsApp Launcher
│       ├── leads/
│       │   ├── page.tsx
│       │   ├── LeadsBrowser.tsx       # Search, filter, form status & quick actions
│       │   └── [id]/page.tsx          # Detail + Client Assessment Card + Stepper
│       ├── sales/page.tsx             # 5-stage sales kanban pipeline
│       ├── followups/page.tsx         # Overdue / Today / Upcoming follow-ups
│       └── settings/page.tsx          # Integrations & team config
├── components/
│   ├── AppShell.tsx / Sidebar.tsx / Topbar.tsx
│   ├── ClientAssessmentCard.tsx       # Capacity profile, demo time & package recommendation
│   ├── AddLeadModal.tsx
│   ├── SendIntakeButton.tsx
│   ├── ui.tsx                         # StatCard, StatusBadge, SourceBadge, etc.
│   └── brand-icons.tsx                # Facebook / Instagram / WhatsApp SVGs
└── lib/
    ├── types.ts                       # Complete TypeScript data model
    ├── data.ts                        # Seed data, categories, OTAs & calculateRecommendation()
    ├── store.ts                       # Server-side JSON persistence layer
    ├── wa.ts                          # WhatsApp message generator & wa.me deep links
    └── format.ts                      # Currency, date & relative time formatters
```

---

## 4. Production Verification (පරීක්ෂා කිරීම්)

- ✅ `npm run build` — 100% clean production build with 0 TypeScript/lint errors.
- ✅ All routes return `200 OK`:
  - `/` (Dashboard)
  - `/generator` (FB & IG Lead Generator)
  - `/leads` (Leads & Assessment List)
  - `/leads/[id]` (Lead Detail + Assessment Card + Strategy Recommendation)
  - `/intake` (Public Client Assessment Form with `?leadId=` prefill support)
  - `/sales` (Sales Kanban Pipeline)
  - `/followups` (Follow-up Manager)
  - `/settings` (Settings & Integrations)
- ✅ End-to-end flow verified via live curl tests:
  1. Lead generated from FB/IG input → Lead ID assigned (`L-1044`).
  2. Public intake form prefills client name and mobile number automatically.
  3. Client submits 10 rooms, Villa, Restaurant, OTAs (Booking & Airbnb).
  4. System updates lead, sets status to `qualified`, assigns recommended package, and schedules demo.
- ✅ Live dev server active on `http://0.0.0.0:3000`.

---

## 5. Contact & Support

**Hotel Mate Marketing Panel**
Owner / Specialist Hotline: **+94 78 860 7143**
Official Website: [hotelmate.co.uk](https://www.hotelmate.co.uk/)
TAGLINE: *All-in-One · Integrated · AI Powered Hotel Management*
