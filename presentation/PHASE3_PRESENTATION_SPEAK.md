# NodiWatch Phase 3 - 15 Minute Session Script

## Session Structure (Total 15 minutes)

- Presentation: 8 minutes
- Live prototype demo: included inside the 8 minutes
- Judge QA: 7 minutes

---

## 1) 8-Minute Presentation Script (with Live Demo)

## 0:00-0:35 | Slide 1 - Opening

Assalamu Alaikum respected judges.
We are Team AlphaVerse, and this is NodiWatch, an AI-powered satellite surveillance platform for Bangladesh rivers.
Our core message is simple: one platform, three river crises, practical enforcement triage intelligence.
The three crises are river pollution, river encroachment, and riverbank erosion.

## 0:35-1:20 | Slide 2 - Problem Statement

Bangladesh faces a measurable river emergency.
Sixty percent of Dhaka river pollution is industrial.
Forty percent of riverbanks are already encroached.
About 10,000 hectares are lost to erosion each year, with roughly 500 million USD annual economic loss.
The main operational gap is delayed detection.
By the time manual inspections confirm violations, damage is already severe and expensive.

## 1:20-1:50 | Slide 3 - Stakeholders

This problem affects multiple decision-makers.
DoE needs pollution triage.
NRCC needs encroachment evidence.
BWDB and DDM need erosion risk warning.
Banks need environmental risk screening for green compliance.
NGOs and development partners need transparent data for planning and accountability.

## 1:50-2:40 | Slides 4a and 4b - Proposed Solution and Workflow

NodiWatch converts free satellite imagery into actionable intelligence.
For pollution, we use spectral fingerprinting.
For encroachment, we use MNDWI-based boundary change over time.
For erosion, we use SAR-based corridor risk analysis.

The pipeline is:
satellite data -> cloud processing -> AI analytics -> cached intelligence -> dashboard -> alerts and reports.
This lets agencies move from reactive field checking to prioritized, targeted inspections.

## 2:40-3:10 | Slide 4c - Architecture and Deployability

The architecture is lean and deployable.
Frontend runs on Next.js, backend services run on FastAPI, and Earth Engine processing runs server-side.
This keeps operational costs lower while maintaining scale potential.
It is designed for hackathon constraints but deployable beyond hackathon scope.

## 3:10-4:05 | Slides 5 and 5b - AI Method and Validation

Our AI stack has four layers:
MNDWI segmentation,
spectral pollution classification,
SAR erosion analysis,
and Bayesian source ranking.

We also show validation transparently.
Current validation indicates 95.3 percent overall accuracy and 0.903 Kappa for segmentation workflow.
We disclose limitations clearly:
10m spatial resolution cannot detect very small encroachment,
Sentinel-2 revisit is periodic,
and factory attribution is probabilistic ranking, not definitive identification.

## 4:05-4:45 | Slide 6a - Product Features

The operational interface is a tri-layer dashboard:
pollution heatmap,
encroachment timeline,
and erosion risk corridors.
Users can click hotspots, inspect severity, view trend context, and generate triage-ready evidence packs.

## 4:45-5:15 | Slide 6b - Evidence and Citizen Ground Truth

NodiWatch combines satellite intelligence with community input.
Citizens submit geo-tagged evidence.
The platform connects citizen reports with satellite context to improve targeting and reduce verification delay.
This creates a practical bridge between community observation and institutional action.

## 5:15-5:45 | Slide 7 - Market Opportunity

Bangladesh has 1,400+ rivers and no unified automated monitoring platform at national scale.
So this is both a public-good need and a strong market opportunity.
Demand side includes government, finance, NGOs, and international partners with climate and ESG mandates.

## 5:45-6:15 | Slides 8a and 8b - Business Model

Our model is free plus paid.
Free tier drives adoption, data participation, and ecosystem trust.
Paid tiers provide advanced monitoring, report automation, custom coverage, and API services.
Revenue paths are B2G government SaaS, B2B compliance API, and B2I ESG data services.

## 6:15-6:40 | Slide 9 - Impact

Impact is operational and social.
Faster triage reduces missed violations,
earlier risk visibility supports embankment planning,
and better targeting can reduce displacement risk and economic losses.
The platform is designed to strengthen climate resilience through periodic automated monitoring.

## 6:40-7:00 | Slide 10 - Phase 3 Positioning

As of April 2026, we are presenting for Phase 3.
Core prototype is deployed.
Current focus is pilot-readiness, workflow hardening, and agency integration.
So this is not only concept validation; it is deployment progression.

## 7:00-7:50 | Slide 10b - Live Prototype Demo (Inside Presentation)

Live demo sequence:

1. Open home dashboard and show the three crisis modules.
2. Open Pollution page and click one hotspot to show severity plus source ranking logic.
3. Open Encroachment page and highlight the historical boundary comparison concept.
4. Open Erosion page and point out corridor risk framing.
5. Open Evidence page and show citizen reporting workflow with AI-assisted analysis.

Demo line to speak:
"What you are seeing is the same operational flow agencies can use: detect, prioritize, verify, and act."

## 7:50-8:00 | Slide 11 - Team and Close

We are Team AlphaVerse, combining AI/ML, backend, geospatial, and frontend engineering.
Our closing message: Bangladesh river protection needs satellite-scale triage intelligence that is practical to operate.
NodiWatch is our Phase 3 answer.
Thank you.

---

## 2) 7-Minute QA Session Bank (15 Judge-Style QA)

Use these as ready answers. Keep each answer about 20 to 30 seconds.

## Q1. What is your core innovation beyond a normal GIS dashboard?

Our core innovation is tri-layer intelligence in one operational flow: spectral pollution clustering, temporal encroachment detection, and SAR-based erosion risk together. Most tools isolate one problem. NodiWatch unifies all three for inspection prioritization.

## Q2. Why use satellite data instead of only field sensors?

Satellite coverage gives broad geographic visibility and repeat monitoring without dense sensor deployment cost. We use satellite outputs for triage and then guide targeted field verification where needed.

## Q3. How accurate is your system right now?

For the segmentation workflow, we show 95.3 percent overall accuracy and 0.903 Kappa in our validation module. We also disclose false positive and false negative behavior and do not claim perfect certainty.

## Q4. Are you claiming legal admissibility directly from the platform?

No. We position outputs as enforcement triage intelligence. Agencies should still run field verification and legal process before formal prosecution actions.

## Q5. What are your biggest technical limitations?

Main limits are 10m spatial resolution for very small structures, periodic revisit gaps, and probabilistic source attribution. We present these clearly and design workflow to include human verification.

## Q6. How do you identify likely polluters?

We use Bayesian ranking based on distance, industrial context, and spectral pattern compatibility around hotspots. We present ranking confidence, not definitive blame.

## Q7. How often can the system update?

It is periodic automated monitoring. Sentinel-2 revisit supports regular updates, and SAR helps continuity during monsoon cloud conditions. We avoid claiming continuous real-time surveillance.

## Q8. Why is this timely for Bangladesh now?

Because losses are compounding while manual inspection capacity is limited. A scalable triage layer helps agencies prioritize scarce field resources where risk is highest.

## Q9. What is your Phase 3 execution focus?

Phase 3 focus is pilot-readiness: integration hardening, data and workflow reliability, and institutional onboarding for practical field use.

## Q10. How will you scale from pilot to 1,400+ rivers?

We start with high-priority corridors, standardize data pipeline templates, and expand basin by basin. Cloud processing and modular architecture support horizontal scaling.

## Q11. Who pays and why will they pay?

Government pays for operational monitoring efficiency and reporting workflow. Banks pay for environmental risk screening and compliance support. International organizations pay for ESG-aligned monitoring data and reporting support.

## Q12. What is your competitive edge against existing mapping tools?

Existing options are often fragmented, manual, or single-problem. Our edge is integrated tri-layer analysis, actionable workflow, and local policy alignment in one platform.

## Q13. How do you handle citizen-report quality and misuse risk?

Citizen reports are support evidence, not standalone truth. We combine GPS context, AI-assisted classification, and analyst review before any enforcement recommendation.

## Q14. What happens if an external data/API service fails?

We use resilient architecture with caching and fallback behaviors for continuity. The system is designed so operations do not fully stop during temporary dependency issues.

## Q15. If selected, what will success look like in the next 3 months?

Success means one active pilot workflow with institutional users, measurable reduction in triage time, and a validated loop from detection to field verification to report generation.

---

## Rapid Closing Line for QA End

"Our commitment is practical impact: make river monitoring faster, more transparent, and easier to act on for agencies that protect Bangladesh."
