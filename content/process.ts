import type { Locale } from "@/content/i18n";

export type ProcessStage = {
  title: string;
  summary: string;
  detail: string;
  activities: string[];
  deliverable: string;
  clientRole: string;
};

export type ProcessCopy = {
  title: string;
  subtitle: string;
  description: string;
  homeDescription: string;
  homeCta: string;
  heroHeadline: string;
  overviewTitle: string;
  journeyTitle: string;
  documentsTitle: string;
  documentsIntro: string;
  documentsNote: string;
  approvalTitle: string;
  approvalIntro: string;
  releaseTitle: string;
  releaseIntro: string;
  faqTitle: string;
  faq: { question: string; answer: string }[];
  finalTitle: string;
  finalText: string;
  contactCta: string;
  documents: { acronym: string; name: string; description: string }[];
  supportingArtifacts: string[];
  checkpoints: { title: string; description: string }[];
  releaseSteps: string[];
  stages: ProcessStage[];
};

const english: ProcessCopy = {
  title: "How we work",
  subtitle: "From your first idea to a working software solution.",
  description: "We follow a structured process that connects business understanding, clear requirements, design approval, development, testing, and launch.",
  homeDescription: "From understanding your business to launching your software, every stage has a clear purpose and deliverable.",
  homeCta: "Explore our full process",
  heroHeadline: "A clear path from business needs to a working release",
  overviewTitle: "The process at a glance",
  journeyTitle: "What happens at each stage",
  documentsTitle: "Documents that make decisions clearer",
  documentsIntro: "We choose the depth of documentation to fit the agreed scope. A smaller engagement may use concise records; a complex solution may need more detailed specifications.",
  documentsNote: "The documents describe the project as agreed. They are reviewed with the client at relevant checkpoints.",
  approvalTitle: "Review and approval checkpoints",
  approvalIntro: "Client feedback helps confirm direction before the next major stage. The number and timing of review rounds depend on the agreed project scope.",
  releaseTitle: "From development to handover",
  releaseIntro: "Staging gives the team and client a place to validate the agreed workflows before production release.",
  faqTitle: "Questions about the process",
  faq: [
    { question: "When do we receive the project scope and cost?", answer: "The business context and requirements are discussed first. A proposal can then describe the agreed scope, deliverables, milestones, estimated schedule, and cost for review before any contract is signed." },
    { question: "What are BRD, PRD, and SRS?", answer: "They are documents for business requirements, product expectations, and software requirements. Which documents are useful, and how detailed they need to be, depends on the project." },
    { question: "Can requirements change after the contract?", answer: "A requested change is reviewed for its effect on scope, deliverables, schedule, and cost. Any change is handled according to the change process agreed in the contract." },
    { question: "When does development begin?", answer: "Development begins after the agreed requirements and scope are understood and the UI/UX design has been approved for the project." },
    { question: "Will we review the design before development?", answer: "Yes. The design is shared for client review and approval before implementation proceeds." },
    { question: "Can we test the software before launch?", answer: "The release candidate is placed in a staging environment for agreed functional, workflow, responsive, integration, and other relevant checks. Issues found are addressed before acceptance." },
    { question: "Can Rakmyat deploy to our existing hosting?", answer: "Deployment is coordinated with the client and can use the client's hosting environment or another provider agreed for the project." },
    { question: "What happens after launch?", answer: "The team verifies the agreed production workflows and completes handover. Any continuing support or maintenance follows the project agreement." },
  ],
  finalTitle: "Ready to turn your requirements into working software?",
  finalText: "Tell us what you’re building, and we’ll start by understanding your business and the outcome you need.",
  contactCta: "Discuss your project",
  documents: [
    { acronym: "BRD", name: "Business Requirements Document", description: "Business objectives, scope, stakeholders, requirements, and intended business outcomes." },
    { acronym: "PRD", name: "Product Requirements Document", description: "Expected functionality, features, user journeys, and acceptance expectations." },
    { acronym: "SRS", name: "Software Requirements Specification", description: "Functional and relevant technical requirements used to guide implementation." },
  ],
  supportingArtifacts: ["Application and user flows", "Approved UI/UX design", "Proposal, contract, and milestones", "Test results and acceptance notes"],
  checkpoints: [
    { title: "Requirements and scope", description: "Align on goals, users, workflows, constraints, and what the solution is expected to cover." },
    { title: "Documentation review", description: "Review relevant requirements, product expectations, application flows, and technical specifications." },
    { title: "Proposal and contract", description: "Agree on scope, deliverables, milestones, schedule estimate, cost, responsibilities, and acceptance conditions." },
    { title: "UI/UX design approval", description: "Review the proposed experience and approve the design before development starts." },
    { title: "Staging review and acceptance", description: "Validate the release candidate and resolve identified issues against agreed acceptance checks." },
    { title: "Production and handover", description: "Coordinate launch, verify key workflows, and hand over agreed access and documentation." },
  ],
  releaseSteps: ["Development", "Staging", "Testing", "Approval", "Production", "Handover"],
  stages: [
    { title: "Discovery", summary: "Understand your goals, users, workflows, and requirements.", detail: "We start with the business context and the people who will use the software, then capture what the project needs to support.", activities: ["Discuss the current situation, goals, and challenges", "Map users, workflows, tools, constraints, and expectations", "Record initial needs and open questions"], deliverable: "Initial requirements and discovery notes", clientRole: "Share context, explain current workflows, and clarify priorities." },
    { title: "Business analysis", summary: "Study the business context and identify what the solution must support.", detail: "The initial information is examined to understand operational needs, roles, dependencies, and potential improvements.", activities: ["Review current workflows and pain points", "Identify users, roles, business rules, and dependencies", "Develop an initial solution direction"], deliverable: "Business analysis findings and an initial solution direction", clientRole: "Validate the findings and confirm that the business context is represented accurately." },
    { title: "BRD & PRD", summary: "Document the business requirements and product expectations.", detail: "Requirements are organized into business objectives and product behavior, reflecting the scope agreed for the project.", activities: ["Define objectives, scope, stakeholders, and requirements", "Describe expected functionality and user journeys", "Set acceptance expectations appropriate to the work"], deliverable: "BRD and PRD, with depth adapted to the project", clientRole: "Review the documents and resolve scope questions before the technical plan proceeds." },
    { title: "Flows & SRS", summary: "Map the application experience and define the software specification.", detail: "Agreed requirements are translated into user and application flows with relevant functional and technical considerations.", activities: ["Map screens, user flows, and core workflows", "Define functional and relevant non-functional requirements", "Consider integrations, data, and permissions"], deliverable: "Application flows and SRS", clientRole: "Review the flows, dependencies, and important requirements." },
    { title: "Agreement", summary: "Confirm deliverables, milestones, costs, and contractual terms.", detail: "The proposal and agreement state what will be delivered and how the work will be reviewed and accepted.", activities: ["Describe approved scope and deliverables", "Set milestones and an estimated schedule", "Agree cost, responsibilities, acceptance, and change handling"], deliverable: "Approved proposal and signed contract", clientRole: "Review and agree the terms before implementation begins." },
    { title: "UI/UX design", summary: "Design the experience and obtain client approval.", detail: "The interface and user experience are designed around the approved requirements, with appropriate responsive considerations.", activities: ["Prepare relevant wireframes and interface designs", "Review user journeys and responsive states", "Incorporate feedback within the agreed scope"], deliverable: "UI/UX design approved for development", clientRole: "Review the design and approve it before development starts." },
    { title: "Development", summary: "Build the approved solution and its integrations.", detail: "The implementation follows the approved requirements and design. The work may include front end, back end, data, access rules, integrations, and ongoing testing as relevant.", activities: ["Implement agreed interface and business behavior", "Connect the required data and systems", "Test the solution during development"], deliverable: "Implemented software ready for staging validation", clientRole: "Review progress at the agreed milestones and clarify project decisions." },
    { title: "Staging & QA", summary: "Test the complete solution in a realistic staging environment.", detail: "The candidate release is checked in a staging environment configured to represent intended production behavior as closely as practical.", activities: ["Test workflows, responsiveness, integrations, and access", "Check validation, errors, performance, security, and regressions as relevant", "Resolve issues and complete agreed acceptance checks"], deliverable: "Tested release candidate ready for client review", clientRole: "Review staging, provide feedback, and confirm acceptance against the agreed criteria." },
    { title: "Launch & handover", summary: "Deploy to production, verify the release, and complete handover.", detail: "After acceptance, production preparation and deployment are coordinated with the client's hosting environment or another agreed provider.", activities: ["Prepare production configuration and coordinate deployment", "Verify key workflows after release", "Provide agreed access, documentation, or guidance"], deliverable: "Live production solution and project handover", clientRole: "Coordinate hosting access, participate in release checks, and receive the agreed handover." },
  ],
};

const arabic: ProcessCopy = {
  title: "كيف نعمل",
  subtitle: "من فكرتك الأولى إلى حل برمجي جاهز للعمل",
  description: "نتبع منهجية واضحة تبدأ بفهم نشاطك ومتطلباتك، ثم توثيق الحل وتصميمه وتطويره واختباره وصولًا إلى الإطلاق.",
  homeDescription: "من فهم نشاطك إلى إطلاق برنامجك، لكل مرحلة هدف واضح ومخرج محدد.",
  homeCta: "اكتشف مراحل العمل بالتفصيل",
  heroHeadline: "مسار واضح من احتياجات العمل إلى حل جاهز للاستخدام",
  overviewTitle: "نظرة سريعة على المراحل",
  journeyTitle: "ما الذي يحدث في كل مرحلة؟",
  documentsTitle: "وثائق تساعد على وضوح القرارات",
  documentsIntro: "نحدد مستوى التوثيق بما يناسب نطاق العمل المتفق عليه. قد يكفي المشروع الأصغر سجلات موجزة، بينما يحتاج الحل الأكثر تعقيدًا إلى مواصفات أكثر تفصيلًا.",
  documentsNote: "تعكس الوثائق ما تم الاتفاق عليه في المشروع، وتُراجع مع العميل عند نقاط المراجعة المناسبة.",
  approvalTitle: "نقاط المراجعة والاعتماد",
  approvalIntro: "تساعد ملاحظات العميل على تأكيد الاتجاه قبل الانتقال إلى مرحلة رئيسية جديدة. ويتحدد عدد المراجعات ومواعيدها وفق نطاق العمل المتفق عليه.",
  releaseTitle: "من التطوير إلى التسليم",
  releaseIntro: "توفر بيئة التجربة مساحة للفريق والعميل للتحقق من مسارات العمل المتفق عليها قبل الإطلاق الفعلي.",
  faqTitle: "أسئلة عن طريقة العمل",
  faq: [
    { question: "متى نعرف نطاق المشروع وتكلفته؟", answer: "نبدأ بمناقشة نشاطك ومتطلباتك. بعد ذلك يمكن إعداد عرض يوضح النطاق والمخرجات والمراحل والمدة التقديرية والتكلفة لمراجعته قبل توقيع أي عقد." },
    { question: "ما المقصود بـ BRD وPRD وSRS؟", answer: "هي وثائق لمتطلبات الأعمال وتوقعات المنتج ومواصفات البرمجيات. ويعتمد اختيار الوثائق ومستوى تفصيلها على طبيعة المشروع." },
    { question: "هل يمكن تغيير المتطلبات بعد توقيع العقد؟", answer: "نراجع أثر أي تغيير مطلوب على النطاق والمخرجات والمدة والتكلفة، ونتعامل معه وفق آلية التغيير المتفق عليها في العقد." },
    { question: "متى يبدأ التطوير؟", answer: "يبدأ التطوير بعد فهم المتطلبات والنطاق المتفق عليه واعتماد تصميم تجربة وواجهة المستخدم للمشروع." },
    { question: "هل نراجع التصميم قبل التطوير؟", answer: "نعم، يُعرض التصميم على العميل للمراجعة والاعتماد قبل بدء التنفيذ." },
    { question: "هل يمكننا اختبار البرنامج قبل إطلاقه؟", answer: "يُجهّز إصدار مرشح على بيئة تجربة لإجراء الاختبارات المتفق عليها، مثل اختبار الوظائف ومسارات العمل والتجاوب والتكاملات. وتُعالج المشكلات قبل الاعتماد النهائي." },
    { question: "هل يمكنكم النشر على الاستضافة الحالية لدينا؟", answer: "يُنسق الإطلاق مع العميل، ويمكن استخدام بيئة الاستضافة الخاصة به أو مزود آخر يتم الاتفاق عليه للمشروع." },
    { question: "ماذا يحدث بعد الإطلاق؟", answer: "نتحقق من مسارات العمل المتفق عليها ونكمل التسليم. وتخضع أي خدمات دعم أو صيانة لاحقة لما ينص عليه اتفاق المشروع." },
  ],
  finalTitle: "هل أنت مستعد لتحويل متطلباتك إلى برنامج يعمل؟",
  finalText: "أخبرنا عما تخطط لبنائه، وسنبدأ بفهم نشاطك والنتيجة التي تحتاج إليها.",
  contactCta: "ناقش مشروعك معنا",
  documents: [
    { acronym: "BRD", name: "وثيقة متطلبات الأعمال", description: "الأهداف ونطاق العمل وأصحاب المصلحة والمتطلبات والنتائج المتوقعة للأعمال." },
    { acronym: "PRD", name: "وثيقة متطلبات المنتج", description: "الوظائف والميزات المتوقعة ورحلات المستخدم ومعايير القبول." },
    { acronym: "SRS", name: "مواصفات متطلبات البرمجيات", description: "المتطلبات الوظيفية والجوانب التقنية المناسبة لتوجيه التنفيذ." },
  ],
  supportingArtifacts: ["تدفقات التطبيق والمستخدم", "تصميم واجهة وتجربة المستخدم المعتمد", "العرض والعقد والمراحل", "نتائج الاختبار وملاحظات القبول"],
  checkpoints: [
    { title: "المتطلبات ونطاق العمل", description: "نتفق على الأهداف والمستخدمين ومسارات العمل والقيود وما يُتوقع أن يشمله الحل." },
    { title: "مراجعة الوثائق", description: "نراجع المتطلبات وتوقعات المنتج وتدفقات التطبيق والمواصفات التقنية المناسبة." },
    { title: "العرض والعقد", description: "نتفق على النطاق والمخرجات والمراحل والمدة التقديرية والتكلفة والمسؤوليات ومعايير القبول." },
    { title: "اعتماد تصميم الواجهة والتجربة", description: "تراجع التصميم المقترح ويُعتمد قبل بدء التطوير." },
    { title: "مراجعة بيئة التجربة والقبول", description: "يُراجع الإصدار المرشح وتُعالج المشكلات وفق اختبارات القبول المتفق عليها." },
    { title: "الإطلاق والتسليم", description: "ننسق الإطلاق، ونتحقق من مسارات العمل الأساسية، ثم نسلّم الوصول والوثائق المتفق عليها." },
  ],
  releaseSteps: ["التطوير", "بيئة التجربة", "الاختبار", "الاعتماد", "الإنتاج", "التسليم"],
  stages: [
    { title: "فهم المتطلبات", summary: "نفهم أهدافك ومستخدميك ومسارات العمل والمتطلبات.", detail: "نبدأ بفهم نشاطك والأشخاص الذين سيستخدمون البرنامج، ثم نوثق ما يحتاج المشروع إلى دعمه.", activities: ["مناقشة الوضع الحالي والأهداف والتحديات", "تحديد المستخدمين ومسارات العمل والأدوات والقيود والتوقعات", "تسجيل الاحتياجات الأولية والأسئلة المفتوحة"], deliverable: "المتطلبات الأولية وملاحظات جلسة الاكتشاف", clientRole: "مشاركة سياق العمل وشرح إجراءاته وتوضيح الأولويات." },
    { title: "تحليل الأعمال", summary: "ندرس سياق العمل ونحدد ما ينبغي أن يدعمه الحل.", detail: "نراجع المعلومات الأولية لفهم الاحتياجات التشغيلية والأدوار والاعتماديات وفرص التحسين.", activities: ["مراجعة إجراءات العمل الحالية والتحديات", "تحديد المستخدمين والأدوار وقواعد العمل والاعتماديات", "صياغة اتجاه أولي للحل"], deliverable: "نتائج تحليل الأعمال واتجاه أولي للحل", clientRole: "مراجعة النتائج والتأكد من دقة تمثيل سياق العمل." },
    { title: "وثائق متطلبات الأعمال والمنتج", summary: "نوثق متطلبات الأعمال وتوقعات المنتج.", detail: "ننظم المتطلبات في أهداف العمل وسلوك المنتج، وفق النطاق المتفق عليه للمشروع.", activities: ["تحديد الأهداف والنطاق وأصحاب المصلحة والمتطلبات", "وصف الوظائف المتوقعة ورحلات المستخدم", "تحديد توقعات القبول بما يناسب المشروع"], deliverable: "وثيقتا BRD وPRD بمستوى تفصيل يناسب المشروع", clientRole: "مراجعة الوثائق وحسم أسئلة النطاق قبل إعداد الخطة التقنية." },
    { title: "تدفقات التطبيق والمواصفات البرمجية", summary: "نرسم تجربة التطبيق ونحدد مواصفات البرنامج.", detail: "نحوّل المتطلبات المتفق عليها إلى تدفقات للمستخدم والتطبيق، مع الجوانب الوظيفية والتقنية المناسبة.", activities: ["رسم الشاشات وتدفقات المستخدم ومسارات العمل الأساسية", "تحديد المتطلبات الوظيفية وغير الوظيفية المناسبة", "مراعاة التكاملات والبيانات والصلاحيات"], deliverable: "تدفقات التطبيق ووثيقة SRS", clientRole: "مراجعة التدفقات والاعتماديات والمتطلبات المهمة." },
    { title: "الاتفاق والتعاقد", summary: "نتفق على المخرجات والمراحل والتكلفة وشروط التعاقد.", detail: "يوضح العرض والاتفاق ما سيتم تسليمه وكيف ستتم مراجعة العمل وقبوله.", activities: ["تحديد النطاق المعتمد والمخرجات", "تحديد المراحل والمدة التقديرية", "الاتفاق على التكلفة والمسؤوليات والقبول وآلية التغيير"], deliverable: "عرض معتمد وعقد موقع", clientRole: "مراجعة الشروط والموافقة عليها قبل بدء التنفيذ." },
    { title: "تصميم تجربة وواجهة المستخدم", summary: "نصمم التجربة ونحصل على اعتماد العميل.", detail: "نصمم الواجهة وتجربة المستخدم وفق المتطلبات المعتمدة مع مراعاة التصفح على الشاشات المناسبة.", activities: ["إعداد المخططات والواجهات المناسبة للمشروع", "مراجعة رحلات المستخدم والحالات المتجاوبة", "تطبيق الملاحظات ضمن النطاق المتفق عليه"], deliverable: "تصميم تجربة وواجهة مستخدم معتمد للتطوير", clientRole: "مراجعة التصميم واعتماده قبل بدء التطوير." },
    { title: "التطوير البرمجي", summary: "نبني الحل المعتمد وننفذ تكاملاته.", detail: "يتبع التنفيذ المتطلبات والتصميم المعتمدين، وقد يشمل الواجهة والخلفية والبيانات والصلاحيات والتكاملات والاختبارات المناسبة.", activities: ["تنفيذ الواجهة وسلوك الأعمال المتفق عليه", "ربط البيانات والأنظمة المطلوبة", "اختبار الحل أثناء التطوير"], deliverable: "برنامج منفذ وجاهز للتحقق على بيئة التجربة", clientRole: "مراجعة التقدم عند المراحل المتفق عليها وتوضيح القرارات المطلوبة." },
    { title: "الاختبار على بيئة التجربة", summary: "نختبر الحل كاملًا على بيئة تجربة واقعية.", detail: "يُراجع الإصدار المرشح في بيئة تجربة تحاكي سلوك الإنتاج المتوقع قدر الإمكان.", activities: ["اختبار مسارات العمل والتجاوب والتكاملات والصلاحيات", "مراجعة التحقق والأخطاء والأداء والأمان والانحدارات حسب الحاجة", "معالجة المشكلات واستكمال اختبارات القبول المتفق عليها"], deliverable: "إصدار مرشح مختبر وجاهز لمراجعة العميل", clientRole: "مراجعة بيئة التجربة وتقديم الملاحظات وتأكيد القبول وفق المعايير المتفق عليها." },
    { title: "الإطلاق والتسليم", summary: "نطلق البرنامج ونتحقق من الإصدار ونكمل التسليم.", detail: "بعد القبول، ننسق الإعداد والنشر على بيئة استضافة العميل أو مزود آخر تم الاتفاق عليه.", activities: ["إعداد بيئة الإنتاج وتنسيق النشر", "التحقق من مسارات العمل الأساسية بعد الإطلاق", "تقديم الوصول والوثائق أو الإرشادات المتفق عليها"], deliverable: "حل منشور وتسليم المشروع", clientRole: "تنسيق الوصول إلى الاستضافة والمشاركة في التحقق واستلام عناصر التسليم المتفق عليها." },
  ],
};

export const processCopy: Record<Locale, ProcessCopy> = { en: english, ar: arabic };
