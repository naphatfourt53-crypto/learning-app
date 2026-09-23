// คลังข้อสอบ Before/After — ย้ายจากโปรเจกต์เก่า LearnStep + ชุด ม.ต้น
// ทุกข้อมี: ตัวเลือก + เฉลยละเอียด (บอกว่าทำไมถูก/ผิด) + จุดที่มักเข้าใจผิด
//
// รูปแบบข้อสอบกันเดา (anti-guess):
// - "single": เลือก 1 ข้อ (ค่าเริ่มต้น, ใช้กับข้อเก่าทั้งหมด)
// - "multi": เลือก "ทุกข้อที่ถูก" — ต้องถูกครบทุกตัวเลือกย่อยถึงจะได้คะแนน
// - "twotier": สองชั้น — ตอบคำตอบ (tier 1) แล้วต้องเลือกเหตุผลที่ถูก (tier 2)
//   เดามั่วถูกทั้งคู่ยากกว่าข้อเดี่ยวมาก (1/4 → ~1/16)

export type QuestionKind = "single" | "multi" | "twotier";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  kind?: QuestionKind;
  /** ระดับความยาก — ใช้ฟิลเตอร์ในโหมดฝึกแบบกำหนดเอง (ค่าเริ่มต้น medium) */
  difficulty?: Difficulty;
  scenario?: string;
  question: string;
  choices: string[];
  /** ใช้กับ kind=single และ tier 1 ของ twotier */
  correctIndex?: number;
  /** ใช้กับ kind=multi: ดัชนีของ "ทุก" ตัวเลือกที่ถูก */
  correctIndices?: number[];
  /** ใช้กับ kind=twotier: คำถามชั้นเหตุผล */
  tier2?: {
    question: string;
    choices: string[];
    correctIndex: number;
  };
  explanation: string;
  misconception: string;
}

export interface QuizSet {
  title: string;
  desc: string;
  /** เกณฑ์ผ่าน (%) — ไม่ถึง = ต้องกลับไปทบทวนบทเรียนก่อน */
  passingScore?: number;
  questions: QuizQuestion[];
}

export interface SubjectQuiz {
  subjectId: string;
  before: QuizSet;
  after: QuizSet;
}

export const QUIZZES: Record<string, SubjectQuiz> = {
  oop: {
    subjectId: "oop",
    before: {
      title: "แบบทดสอบวัดความพร้อมก่อนเรียน (Diagnostic Pre-Test)",
      desc: "วัดความเข้าใจระดับรากฐานและสัญชาตญาณเชิงสถาปัตยกรรมก่อนเริ่มเรียน",
      questions: [
        {
          id: "oop-pre-1",
          scenario: "การออกแบบระบบธุรกรรมใน FinTech Core Banking",
          question:
            "ในการออกแบบ Class ตามหลัก Encapsulation ข้อใดอธิบายได้ถูกต้องที่สุด?",
          choices: [
            "การทำให้ Attribute ทุกตัวเป็น private แล้วสร้าง getter/setter เปิดให้อ่านเขียนได้ครบทุกตัวเพื่อความสะดวก",
            "การรวม Data และ Operation เข้าด้วยกัน เพื่อปกป้องสถานะของอ็อบเจกต์ไม่ให้หลุดจากกฎทางธุรกิจ (Class Invariant) ผ่านการจำกัดช่องทางการเปลี่ยนแปลง",
            "การแยกโค้ด Business Logic ออกไปเป็น Global Function แล้วให้ Class เป็นเพียงที่เก็บตัวแปรชั่วคราว",
            "การทำให้คลาสทำงานร่วมกับ Database ได้โดยไม่ต้องแปลงประเภทข้อมูล",
          ],
          correctIndex: 1,
          explanation:
            "หัวใจของ Encapsulation ไม่ใช่แค่ตั้ง private แล้วเขียน getter/setter ทื่อๆ แต่คือการเป็นขอบเขตปกป้อง Invariant เพื่อรับรองว่าข้อมูลภายในจะถูกต้องตามกฎธุรกิจเสมอ",
          misconception:
            "ผู้เรียนจำนวนมากเข้าใจผิดว่า Encapsulation คือการเขียน getter/setter แต่ Class ที่ดีไม่ควรเปิด Setter ให้เขียนทับค่าโดยตรงหากไม่มี Business Validation",
        },
        {
          id: "oop-pre-2",
          scenario: "การจัดการ Cache และ Memory ในระบบ High-Throughput Server",
          question:
            "เมื่อเมทอดภายนอกรับอ็อบเจกต์ (Reference-based เช่น Java/C#/JS) เข้ามาแล้วแก้ไขฟิลด์ภายใน จะเกิดผลกระทบต่อ Caller อย่างไร?",
          choices: [
            "ไม่มีผลกระทบ เพราะภาษาจะคัดลอก Heap ทั้งหมดเป็น Object ใหม่ให้อัตโนมัติ (Deep Copy)",
            "อ็อบเจกต์ต้นทางของ Caller จะถูกแก้ไขตามไปด้วย เพราะทั้งสองชี้ไปยังหน่วยความจำตำแหน่งเดียวกันบน Heap (Shallow Reference)",
            "โปรแกรมจะตัดการทำงานและแจ้ง Fatal Memory Violation ทันที",
            "ตัวแปรจะกลายเป็น Immutable ชั่วคราวเฉพาะตอนฟังก์ชันกำลังประมวลผล",
          ],
          correctIndex: 1,
          explanation:
            "Object ส่วนใหญ่ถูกจัดสรรบน Heap ตัวแปรเก็บเพียง Reference เมื่อส่งเข้าฟังก์ชันคือการส่งสำเนาของ Reference การแก้ไขข้างในจึงส่งผลถึงตัวเดิมทันที",
          misconception:
            "ความสับสนระหว่าง Pass-by-value ของตัว Reference เอง กับการแก้ไข State ภายในอ็อบเจกต์ที่ถูกชี้ถึง",
        },
        {
          id: "oop-pre-3",
          scenario: "การสร้าง Plugin Architecture / Payment Gateway",
          question:
            "เหตุใดระบบชำระเงินจึงควรใช้ Polymorphism (ผ่าน Interface) แทนการเขียน if-else ตรวจสอบประเภท?",
          choices: [
            "เพราะ if-else ทำให้โปรแกรมกิน RAM เพิ่มขึ้นเป็น 10 เท่าเสมอ",
            "เพื่อให้สอดคล้องกับ Open-Closed Principle: เพิ่มผู้ให้บริการเจ้าใหม่ได้โดยไม่ต้องแตะต้องหรือคอมไพล์โค้ดประมวลผลเดิมใหม่",
            "เพราะคอมไพเลอร์ไม่อนุญาตให้ใช้ if-else ร่วมกับคลาสที่สืบทอดมา",
            "เพื่อให้ฟังก์ชันชำระเงินรันแบบ Multi-thread ได้อัตโนมัติ",
          ],
          correctIndex: 1,
          explanation:
            "Polymorphism ช่วย decouple ผู้เรียกออกจาก Implementation ทำให้ระบบขยายได้ง่าย: เพิ่ม Provider ใหม่แค่สร้าง Class มา Implement โดยไม่แก้โค้ดหลัก",
          misconception:
            "การคิดว่า Polymorphism เป็นเพียงลูกเล่นไวยากรณ์ ทั้งที่จริงคือเสาหลักของสถาปัตยกรรมแบบ Modular และ Plugin",
        },
      ],
    },
    after: {
      title: "แบบทดสอบวัดผลสัมฤทธิ์หลังเรียน (Rigorous Post-Test)",
      desc: "ประเมินความลึกซึ้งในการแก้ปัญหาเชิงสถาปัตยกรรมจริงและการตัดสินใจ Trade-off",
      questions: [
        {
          id: "oop-post-1",
          scenario: "การออกแบบสถาปัตยกรรม Game Engine (Unreal / Unity)",
          question:
            "เมื่อตัวละครมีความสามารถผสมกัน (บินได้, ดำน้ำได้, ยิงเวทได้) เหตุใดจึงควรใช้ Composition แทนการสืบทอดหลายชั้น?",
          choices: [
            "เพราะการสืบทอดลึกทำให้คลาสลูกผูกติดกับคลาสแม่แน่นเกินไป เกิด Class Explosion แบบทวีคูณเมื่อผสมความสามารถกัน",
            "เพราะ CPU สมัยใหม่ประมวลผลคำสั่งของคลาสลูกที่สืบทอดเกิน 2 ชั้นไม่ได้เลย",
            "เพราะการใช้ Composition บังคับให้โค้ดทั้งหมดกลายเป็น Functional Programming",
            "เพราะการสืบทอดทำให้ใช้ตัวแปรประเภท String ภายในคลาสไม่ได้",
          ],
          correctIndex: 0,
          explanation:
            "ถ้าใช้ Inheritance จะเกิด FlyingWarrior, SwimmingWarrior, FlyingSwimmingWarrior มหาศาล แต่ Composition ให้ตัวละครถือ Component [Flyable, Swimmable] ยืดหยุ่นกว่ามาก",
          misconception:
            "ผู้เรียนมักคิดว่า OOP = Inheritance แล้วสร้างต้นไม้คลาสสูงๆ ทั้งที่ในวิศวกรรมจริงนิยม Composition มากกว่า",
        },
        {
          id: "oop-post-2",
          scenario: "การออกแบบ Graphic Library และ Geometric Math Engine",
          question:
            "ถ้าสร้าง Square สืบทอดจาก Rectangle โดยบังคับให้ตั้ง Width แล้ว Height เปลี่ยนตามเสมอ โค้ดนี้ละเมิดหลักการใด?",
          choices: [
            "ละเมิด Encapsulation เพราะฟังก์ชันไม่ยอมให้เข้าถึงข้อมูลภายนอก",
            "ละเมิด Liskov Substitution Principle (LSP) เพราะ Square แทนที่ Rectangle ไม่ได้ในทุกกรณีที่ Caller คาดหวัง",
            "ละเมิด Abstraction เพราะ Square ใช้สูตรคำนวณพื้นที่ของตัวเอง",
            "ละเมิด Data Normalization ของระบบฐานข้อมูล",
          ],
          correctIndex: 1,
          explanation:
            "ตาม LSP คลาสลูกต้องแทนที่คลาสแม่ได้โดยไม่ทำลายพฤติกรรมที่ Caller คาดหวัง — ตัวอย่างระดับตำนานของการละเมิด LSP",
          misconception:
            "กับดักทางตรรกะ: สิ่งที่เป็นจริงทางเรขาคณิต (Is-A) อาจไม่ใช่ Is-A ในทางพฤติกรรมของซอฟต์แวร์",
        },
        {
          id: "oop-post-3",
          scenario: "การพัฒนา High-Performance Trading System / Device Driver",
          question:
            "เบื้องหลัง Dynamic Polymorphism เมื่อเรียก virtual/overridden method ระบบใช้กลไกใดหาฟังก์ชันที่ถูกต้องขณะ Runtime?",
          choices: [
            "สแกนโค้ดทั้งโปรแกรมทีละบรรทัดทุกครั้งที่มีการเรียกเมทอด",
            "ค้นหาผ่าน Virtual Method Table (VTable) ซึ่งเป็น Array ของ Function Pointer โดยแต่ละ Object มี vptr ชี้ไปยัง VTable ของคลาสตน",
            "ส่งข้อมูลไปถาม Server กลางผ่าน Network เพื่อขอไฟล์ไบนารีของฟังก์ชัน",
            "แปลงโค้ดคลาสลูกให้กลายเป็นคำสั่ง if-else ในระดับ CPU Register",
          ],
          correctIndex: 1,
          explanation:
            "Dynamic dispatch ทำงานผ่าน VTable: อ่าน address จาก VTable offset แล้วกระโดดไป execute ทันที มี overhead เพียง pointer indirection เล็กน้อย",
          misconception:
            "ความเข้าใจผิดว่า Polymorphism เกิดขึ้นได้แบบมหัศจรรย์โดยไม่มีกลไกจัดการหน่วยความจำรองรับ",
        },
      ],
    },
  },
  calculus: {
    subjectId: "calculus",
    before: {
      title: "แบบทดสอบวัดความพร้อมก่อนเรียน (Calculus Diagnostic)",
      desc: "ประเมินความเข้าใจเชิงเรขาคณิตและมิติความชันก่อนศึกษาแคลคูลัสขั้นสูง",
      questions: [
        {
          id: "cal-pre-1",
          scenario: "การวิเคราะห์การเคลื่อนที่ของยานอวกาศหรือรถไฟความเร็วสูง",
          question:
            "เมื่อพิจารณากราฟระยะทาง (s) เทียบกับเวลา (t) ความหมายเชิงกายภาพของอนุพันธ์อันดับหนึ่ง ds/dt ณ จุด t = t₀ คืออะไร?",
          choices: [
            "ระยะทางสะสมทั้งหมดตั้งแต่เริ่มปล่อยตัวจนถึงเวลา t₀",
            "ความเร็วขณะใดขณะหนึ่ง (Instantaneous Velocity) ซึ่งสอดคล้องกับความชันของเส้นสัมผัสกราฟ ณ จุดนั้น",
            "ความเร่งเฉลี่ยตลอดช่วงการเดินทางทั้งหมด",
            "พื้นที่ใต้กราฟระหว่างแกนเวลาและเส้นระยะทาง",
          ],
          correctIndex: 1,
          explanation:
            "อนุพันธ์อันดับหนึ่งของระยะทางเทียบกับเวลาคือความเร็วขณะใดขณะหนึ่ง ในทางเรขาคณิตคือความชันของเส้นสัมผัสกราฟ",
          misconception:
            "ความสับสนระหว่างค่าฟังก์ชัน (ตำแหน่ง), อนุพันธ์อันดับหนึ่ง (ความเร็ว), และอนุพันธ์อันดับสอง (ความเร่ง)",
        },
        {
          id: "cal-pre-2",
          scenario: "การหาจุดคุ้มทุนในการผลิตหรือจุดประหยัดพลังงานสูงสุด",
          question:
            "หากฟังก์ชันต้นทุน C(x) มีจุดที่ C′(x₀) = 0 เงื่อนไขใดบ่งชี้ว่าจุดนั้นเป็นจุดต่ำสุดสัมพัทธ์ (Local Minimum)?",
          choices: [
            "ค่าของฟังก์ชัน ณ จุดนั้นต้องติดลบ (C(x₀) < 0) เท่านั้น",
            "อนุพันธ์อันดับสอง C′′(x₀) > 0 แสดงว่ากราฟหงายขึ้น (Concave Up)",
            "อนุพันธ์อันดับสอง C′′(x₀) = 0",
            "ค่า x₀ ต้องเป็นจำนวนเต็มบวก",
          ],
          correctIndex: 1,
          explanation:
            "ตาม Second Derivative Test หาก f′′(x₀) > 0 ความชันกำลังเปลี่ยนจากลบไปเป็นบวก (กราฟหงาย) จึงเป็นจุดต่ำสุดสัมพัทธ์",
          misconception:
            "หลายคนจำสลับว่าค่าต่ำสุดต้อง f′′ < 0 แต่ความจริง f′′ > 0 คือกราฟหงายจึงเกิดจุดต่ำสุด",
        },
      ],
    },
    after: {
      title: "แบบทดสอบวัดผลสัมฤทธิ์หลังเรียน (Real-World Calculus)",
      desc: "ทดสอบการประยุกต์ใช้อนุพันธ์ในระบบวิศวกรรมจริง AI และคอนโทรลเลอร์ยานยนต์",
      questions: [
        {
          id: "cal-post-1",
          scenario: "การเทรนโครงข่ายประสาทเทียมในระบบรู้จำเสียง/ภาพ",
          question:
            "ใน Gradient Descent เหตุใดจึงต้องปรับพารามิเตอร์ด้วย w_new = w_old − (α × dLoss/dw) (สังเกตเครื่องหมายลบ)?",
          choices: [
            "เพราะ Gradient ชี้ไปทางที่ Loss เพิ่มขึ้นเร็วที่สุด (Ascent) การก้าวทิศตรงข้ามจึงเป็นการลดความผิดพลาดลงสู่จุดต่ำสุด",
            "เพราะมาตรฐานภาษา Python กำหนดให้ฟังก์ชันคณิตศาสตร์ต้องมีเครื่องหมายลบนำหน้าเสมอ",
            "เพราะใช้เครื่องหมายบวกจะทำให้โปรแกรมค้างจาก Infinite Loop ใน Memory",
            "เพื่อให้พารามิเตอร์กลายเป็นจำนวนเฉพาะ (Prime Number)",
          ],
          correctIndex: 0,
          explanation:
            "Gradient คือเวกเตอร์ชี้ทางขึ้นชันสุด ในการหาจุดต่ำสุดจึงต้องเดินสวนทางกับความชัน (Negative Gradient Direction)",
          misconception:
            "การท่องจำสูตรโดยไม่เข้าใจว่าเครื่องหมายลบคือการตัดสินใจเดินลงหุบเขาความผิดพลาด",
        },
        {
          id: "cal-post-2",
          scenario: "การควบคุมโดรน Quadcopter รักษาระดับขณะเจอลมกรรโชก",
          question: "ในระบบควบคุมแบบ PID ส่วน Derivative (D) ทำหน้าที่อะไร?",
          choices: [
            "วัดอัตราการเปลี่ยนแปลงของความผิดพลาดเพื่อสร้างแรงต้านล่วงหน้า คาดการณ์อนาคตและลดการแกว่งส่าย (Overshoot)",
            "สะสมประจุไฟฟ้าในแบตเตอรี่เพื่อจ่ายไฟฉุกเฉินให้มอเตอร์",
            "คำนวณผลรวมของความผิดพลาดสะสมตั้งแต่อดีตเพื่อชดเชยแรงคงค้าง",
            "สุ่มสัญญาณรบกวนเพื่อทดสอบความทนทานของฮาร์ดแวร์",
          ],
          correctIndex: 0,
          explanation:
            "D คำนวณ de(t)/dt หาก Error ลดลงเร็ว ส่วน D จะสร้างแรงเบรกหน่วงล่วงหน้า ป้องกันพุ่งเลยเป้าหมาย",
          misconception:
            "ความสับสนระหว่างหน้าที่ของ P (แก้ปัจจุบัน), I (แก้ผลรวมในอดีต), และ D (คาดการณ์แนวโน้มอนาคต)",
        },
      ],
    },
  },
  react: {
    subjectId: "react",
    before: {
      title: "แบบทดสอบวัดความพร้อมก่อนเรียน (React Diagnostic)",
      desc: "ประเมินความรู้เชิงลึกเกี่ยวกับ JavaScript Closures และการทำงานของ DOM",
      questions: [
        {
          id: "react-pre-1",
          scenario: "การเข้าใจกลไกการจดจำ State ของ useState ข้าม Render Loop",
          question:
            "กลไกใดใน JavaScript ที่ทำให้ฟังก์ชันในคอมโพเนนต์ยังเข้าถึงค่า State จาก Render รอบก่อนหน้าได้?",
          choices: [
            "JavaScript Closures — ฟังก์ชันลูกจดจำขอบเขต Lexical Scope ของฟังก์ชันแม่ที่ครอบมันอยู่",
            "การบันทึกตัวแปรลง Hard Disk อัตโนมัติผ่าน LocalStorage ทุกรอบ",
            "การแปลงโค้ดทั้งหมดเป็น WebAssembly ก่อนรันในเบราว์เซอร์",
            "การแชร์ตัวแปรผ่าน Window Global Scope เสมอ",
          ],
          correctIndex: 0,
          explanation:
            "React Hooks ทำงานร่วมกับ Closures อย่างแนบแน่นในการจัดเก็บและเข้าถึงสถานะของ Fiber Node ในแต่ละรอบเรนเดอร์",
          misconception:
            "การมองข้ามพื้นฐาน Closures ทำให้เกิดบั๊ก Stale Closure ใน useEffect ในเวลาต่อมา",
        },
        {
          id: "react-pre-2",
          scenario: "การแก้ไขบั๊กหน้าจอไม่ยอมอัปเดตเมื่ออาร์เรย์มีข้อมูลใหม่",
          question:
            "เมื่อ state เก็บอาเรย์ แล้วเขียน items.push(x); setItems(items) ทำไมหน้าจอมักไม่อัปเดต?",
          choices: [
            "เพราะคำสั่ง push() ถูก React บล็อกไว้",
            "เพราะ push() แก้ไขอาเรย์เดิม (Mutation) ทำให้ Reference ยังชี้ Address เดิม React เทียบแล้วถือว่าไม่มีอะไรเปลี่ยนจึงข้ามการเรนเดอร์",
            "เพราะ React รองรับเฉพาะตัวเลข 1 ถึง 3 เท่านั้น",
            "เพราะ setItems ต้องใช้ควบคู่กับ async/await เสมอ",
          ],
          correctIndex: 1,
          explanation:
            "React เปรียบเทียบแบบตื้น (Shallow Comparison) เมื่อ reference เดิมไม่เปลี่ยนจึงข้ามการเรนเดอร์ วิธีที่ถูกคือสร้าง Array ใหม่ (เช่น [...items, x])",
          misconception:
            "บั๊กอันดับหนึ่งของมือใหม่: Mutate state ตัวเดิมโดยตรงแทนที่จะคืนค่า Reference ใหม่",
        },
      ],
    },
    after: {
      title: "แบบทดสอบวัดผลสัมฤทธิ์หลังเรียน (Modern React Engineering)",
      desc: "ทดสอบความลึกซึ้งเรื่อง Virtual DOM, Reconciliation และ Stale Closures",
      questions: [
        {
          id: "react-post-1",
          scenario: "การเพิ่มประสิทธิภาพของตารางข้อมูลขนาดใหญ่ (Data Grid)",
          question:
            "เหตุใดจึงมีคำเตือนเคร่งครัดว่าห้ามใช้ Array Index เป็น key หากรายการลบ/แทรกตรงกลาง/สลับลำดับได้?",
          choices: [
            "เพราะเมื่อแทรกหรือลบตรงกลาง Index ของไอเทมถัดไปเปลี่ยนหมด Diffing จะจับคู่ State ของลูกผิดตัว เกิดบั๊กแสดงข้อมูลผิดหรือ Input สลับช่อง",
            "เพราะ React จะไม่อนุญาตให้เซฟไฟล์หากมีตัวเลขเป็น key",
            "เพราะ Array Index ทำให้ไฟล์ HTML ใหญ่ขึ้นเป็นสองเท่า",
            "เพราะการใช้ Index บังคับให้เว็บรีโหลดทั้งหน้าใหม่เสมอ",
          ],
          correctIndex: 0,
          explanation:
            "Key คือเอกลักษณ์ถาวรของ Node ข้ามรอบ Render หากใช้ Index เมื่อลบไอเทมแรก ไอเทมที่สองจะกลายเป็น Index 0 ทันที React เข้าใจผิดว่าตัวเดิมยังอยู่แต่เปลี่ยน Props ทำให้ State พัง",
          misconception:
            "การใช้ index เป็น key เพียงเพื่อให้ Warning หายไป โดยไม่เข้าใจผลข้างเคียงต่อ UI State",
        },
        {
          id: "react-post-2",
          scenario: "การสร้างระบบ Real-time Chat / WebSocket Listener",
          question:
            "หาก useEffect มี Dependency Array ว่าง ([]) แต่ callback ภายในอ่านค่า count จาก State จะเกิดอะไรขึ้น?",
          choices: [
            "แสดงค่า count ล่าสุดได้ถูกต้องเสมอเพราะ React มี Two-way Binding",
            "เกิด Stale Closure: ฟังก์ชันถูกสร้างครั้งเดียวตอน Mount จึงจำเฉพาะค่า count ณ จังหวะแรก (เช่น 0) และไม่อ่านค่าปัจจุบันอีกเลย",
            "เบราว์เซอร์จะปิดแท็บทันทีเพราะเกิด Memory Leak",
            "ค่า count จะกลายเป็น undefined ในทุกกรณี",
          ],
          correctIndex: 1,
          explanation:
            "เนื่องจาก deps ว่าง callback ถูกสร้างครั้งเดียวตอน Mount มันจึงจับ Lexical Scope ของรอบแรกตลอดไป วิธีแก้คือใส่ count ใน Dependency หรือใช้ Functional Updater",
          misconception:
            "การลืมใส่ตัวแปรที่ใช้ลงใน Dependency Array ทำให้ฟังก์ชันจับค่าเก่าในอดีต (Stale Value)",
        },
      ],
    },
  },
  genetics: {
    subjectId: "genetics",
    before: {
      title: "แบบทดสอบวัดความพร้อมก่อนเรียน (Genetics Diagnostic)",
      desc: "ประเมินความรู้พื้นฐานเรื่อง Central Dogma และรหัสพันธุกรรม",
      questions: [
        {
          id: "gen-pre-1",
          scenario: "การเข้าใจกลไกการผลิตฮอร์โมนอินซูลินสังเคราะห์ในแบคทีเรีย",
          question:
            "ตามหลัก Central Dogma การไหลเวียนของข้อมูลทางพันธุกรรมในเซลล์มาตรฐานเป็นไปตามลำดับใด?",
          choices: [
            "DNA ถูกถอดรหัส (Transcription) เป็น mRNA แล้วถูกแปลรหัส (Translation) ไปเป็นโปรตีน",
            "โปรตีนแปลงกลับเป็น DNA โดยตรงเพื่อนำไปสร้างเยื่อหุ้มเซลล์",
            "กรดอะมิโนถูกสังเคราะห์ก่อน แล้วจึงนำไปประกอบเป็น DNA ในนิวเคลียส",
            "DNA ลอยออกจากเซลล์เพื่อไปจับกับแอนติบอดีในกระแสเลือด",
          ],
          correctIndex: 0,
          explanation:
            "ลำดับมาตรฐานคือ DNA → (Transcription) → RNA → (Translation) → Protein",
          misconception:
            "ความสับสนระหว่างขั้นตอน Transcription (ถอดรหัสสำเนา) กับ Translation (แปลรหัสสร้างโปรตีน)",
        },
      ],
    },
    after: {
      title: "แบบทดสอบวัดผลสัมฤทธิ์หลังเรียน (Modern Biotechnology)",
      desc: "ทดสอบความเข้าใจสิ่งประดิษฐ์ทางการแพทย์ยุคใหม่ เช่น วัคซีน mRNA และกลไก CRISPR",
      questions: [
        {
          id: "gen-post-1",
          scenario: "รางวัลโนเบลสรีรวิทยาการแพทย์ (Katalin Karikó & Drew Weissman)",
          question:
            "ในการพัฒนาวัคซีน mRNA เหตุใดนักวิทยาศาสตร์ต้องเปลี่ยนเบส Uridine ให้เป็น Pseudouridine?",
          choices: [
            "เพื่อป้องกันไม่ให้ระบบภูมิคุ้มกันดั้งเดิม (Innate) มองว่า mRNA เป็นสิ่งแปลกปลอมแล้วทำลายทิ้งก่อนผลิตโปรตีนหนาม",
            "เพื่อให้วัคซีนมีรสชาติหวานรับประทานง่าย",
            "เพื่อบังคับให้เซลล์กลายพันธุ์เป็นเซลล์อมตะ",
            "เพื่อเปลี่ยนสาย mRNA ให้กลายเป็นโลหะนำไฟฟ้า",
          ],
          correctIndex: 0,
          explanation:
            "Pseudouridine ลดการกระตุ้น Toll-like receptors (TLRs) ทำให้เซลล์ไม่สั่งทำลาย mRNA สังเคราะห์ และยอมแปลรหัสสร้างโปรตีนเป้าหมายได้สำเร็จ",
          misconception:
            "การไม่ทราบว่าร่างกายมีระบบดักจับและย่อยสลาย RNA แปลกปลอมที่มีประสิทธิภาพสูงมาก",
        },
      ],
    },
  },
};

import { MS_QUIZZES } from "./ms-quizzes";
import { EXTRA_QUIZZES } from "./extra-quizzes";

const ALL_QUIZZES: Record<string, SubjectQuiz> = {
  ...QUIZZES,
  ...MS_QUIZZES,
  ...EXTRA_QUIZZES,
};

export function getQuiz(subjectId: string): SubjectQuiz | undefined {
  return ALL_QUIZZES[subjectId];
}

export interface BankItem {
  subjectId: string;
  mode: "before" | "after";
  question: QuizQuestion;
}

/** คลังข้อรวมทุกวิชา — ใช้สร้างแบบทดสอบแบบกำหนดเอง */
export function getQuestionBank(): BankItem[] {
  const out: BankItem[] = [];
  for (const [subjectId, sq] of Object.entries(ALL_QUIZZES)) {
    for (const q of sq.before.questions) out.push({ subjectId, mode: "before", question: q });
    for (const q of sq.after.questions) out.push({ subjectId, mode: "after", question: q });
  }
  return out;
}
