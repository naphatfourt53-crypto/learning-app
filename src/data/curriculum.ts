// แหล่งเรียนรู้ (Learning Library) — ย้ายและปรับจากโปรเจกต์เก่า LearnStep
// ครอบคลุม 4 วิชา: OOP, Calculus, React, Genetics
// แต่ละวิชามี: บทเรียน + พื้นฐานที่ต้องรู้ก่อน + บทเรียนต่อยอด + แหล่งข้อมูลเพิ่มเติม

export interface LessonSection {
  heading: string;
  body: string;
  example?: string;
  formula?: string;
  warning?: string;
}

export interface Lesson {
  title: string;
  summary: string;
  /** บทสอนแบบละเอียด: ถ้ามี หน้าเว็บจะเรนเดอร์เป็นบทเรียนจริง */
  sections?: LessonSection[];
}

export interface TopicLink {
  title: string;
  desc: string;
  level?: string;
}

export interface Resource {
  title: string;
  desc: string;
  meta: string;
}

export interface Subject {
  id: string;
  title: string;
  desc: string;
  category: string;
  level: string;
  duration: string;
  /** แถบชั้นเรียน เช่น "ม.ต้น", "มหาวิทยาลัย/ทั่วไป" — ใช้จัดกลุ่มในห้องสมุด */
  gradeBand?: string;
  lessons: Lesson[];
  prerequisites: TopicLink[];
  nextSteps: TopicLink[];
  resources: Resource[];
}

export const SUBJECTS: Subject[] = [
  {
    id: "oop",
    title: "การเขียนโปรแกรมเชิงวัตถุ (OOP)",
    desc: "ทำความเข้าใจกลไกภายในของ OOP (Memory Model, VTable, Invariant Enforcement) และวิธีที่ระบบซอฟต์แวร์ระดับโลกใช้ OOP ร่วมกับ Pattern อื่นๆ",
    category: "วิทยาการคอมพิวเตอร์และวิศวกรรมซอฟต์แวร์",
    level: "ขั้นสูง (Advanced)",
    duration: "8–10 ชั่วโมง",
    lessons: [
      {
        title: "1. บอกบท & แก่นแท้: ทำไมโลกวิศวกรรมจึงคิดค้น OOP?",
        summary:
          "ก่อนหน้า OOP โค้ดถูกเขียนแบบ Procedural ข้อมูลแยกขาดจากฟังก์ชัน เมื่อระบบใหญ่ขึ้นใครก็แก้ตัวแปรได้จากทุกที่ OOP ไม่ใช่แค่เอาฟังก์ชันใส่คลาส แต่คือการสร้างขอบเขตปกป้อง Invariant โดยมี Encapsulation เป็นเกราะคุ้มกัน ตัวอย่างจริง: หน้าต่าง-ปุ่มใน GUI, ORM แปลงตาราง DB เป็น Object, class BankAccount ป้องกัน balance = -9999",
      },
      {
        title: "2. กลไกเชิงลึก: VTable และการประยุกต์ร่วมกับ ECS",
        summary:
          "เข้าใจข้อจำกัดของ Deep Inheritance (Fragile Base Class, Class Explosion) กลไก VTable/vptr ของ Polymorphism และแนวคิด Composition Over Inheritance แบบ Entity-Component-System สำหรับงาน High-Performance",
      },
    ],
    prerequisites: [
      {
        title: "พื้นฐานการเขียนโปรแกรม (Variables, Control Flow & Functions)",
        desc: "ต้องเข้าใจตัวแปร, การวนลูป if/else และขอบเขตฟังก์ชัน (Scope) ก่อนจึงจะสร้าง Class ได้",
        level: "จำเป็นมาก (Must-have)",
      },
      {
        title: "โครงสร้างข้อมูลและหน่วยความจำ (Stack vs Heap & Pointer)",
        desc: "เพื่อให้เข้าใจกลไกการอ้างอิงตำแหน่งหน่วยความจำของ Object และการเกิด Shallow vs Deep Copy",
      },
      {
        title: "การแบ่งโมดูลและแยกไฟล์โค้ด (Code Modularization)",
        desc: "สำคัญในการจัดระเบียบ Class หลายไฟล์และการ import/export เพื่อเลี่ยง Circular Dependency",
        level: "แนะนำ (Recommended)",
      },
    ],
    nextSteps: [
      {
        title: "การเขียนโปรแกรมเชิงฟังก์ชัน (Functional Paradigm)",
        desc: "เปรียบเทียบแนวคิด Pure Functions และ Immutability กับ OOP State Mutation",
      },
      {
        title: "รูปแบบการออกแบบซอฟต์แวร์ (GoF Design Patterns)",
        desc: "การประยุกต์ใช้คลาสและอินเทอร์เฟซเพื่อแก้ปัญหาเชิงสถาปัตยกรรมระดับองค์กร",
      },
      {
        title: "Microservices, Clean Architecture & MVC/Hexagonal",
        desc: "ยกระดับ OOP สู่สถาปัตยกรรมระดับองค์กร แยก Model-View-Controller อย่างเป็นระบบ",
      },
    ],
    resources: [
      {
        title: "คัมภีร์ Design Patterns 23 แบบของ Gang of Four",
        desc: "หนังสือที่วิศวกรซอฟต์แวร์ทุกคนต้องศึกษา",
        meta: "หนังสือ • 416 หน้า",
      },
      {
        title: "Unit Testing & TDD สำหรับ OOP",
        desc: "การเขียน Mock/Stub ทดสอบ Class และ Interface โดยไม่ผูกติดกับ Database จริง",
        meta: "บทความ • การันตีคุณภาพระดับ Mission-Critical",
      },
      {
        title: "SOLID Principles & Enterprise Architecture",
        desc: "ยกระดับการเขียน OOP สู่สถาปัตยกรรมที่ยืดหยุ่น ขยายได้โดยไม่ทำลายโค้ดเดิม",
        meta: "บทความ • Robert C. Martin / 350 หน้า",
      },
    ],
  },
  {
    id: "calculus",
    title: "แคลคูลัสและอนุพันธ์ (Calculus)",
    desc: "ทำความเข้าใจความหมายเชิงเรขาคณิตและกายภาพของอนุพันธ์ การหาจุดต่ำสุด/สูงสุดของฟังก์ชัน และการนำไปสร้างระบบควบคุมอัตโนมัติและโครงข่ายประสาทเทียม",
    category: "คณิตศาสตร์และวิศวกรรมการคำนวณ",
    level: "ปานกลาง (Intermediate)",
    duration: "5–7 ชั่วโมง",
    lessons: [
      {
        title: "1. บอกบท & แก่นแท้: อนุพันธ์คืออะไรในธรรมชาติ?",
        summary:
          "อนุพันธ์ไม่ใช่แค่สูตร x^n → n·x^(n-1) แต่คือเครื่องวัดว่าขยับตัวแปรต้นนิดเดียว ตัวแปรตามจะพุ่งขึ้นหรือดิ่งลงแรงแค่ไหน ตัวอย่างจริง: PID Controller ในรถไร้คนขับ, Backpropagation ใน Deep Neural Networks",
      },
      {
        title: "2. Gradient Descent: ค้นหาจุดต่ำสุดของ Loss",
        summary:
          "ใช้อนุพันธ์ย่อยคำนวณการขยับ Weights เพื่อลด Loss พร้อมโค้ดตัวอย่าง f(w) = w² และความเชื่อมโยงกับ GPU Tensors และพีชคณิตเชิงเส้น",
      },
    ],
    prerequisites: [
      {
        title: "ฟังก์ชันและกราฟ (Functions, Limits & Continuity)",
        desc: "ต้องเข้าใจความต่อเนื่องของกราฟและนิยามของลิมิตก่อนจึงจะนิยามอนุพันธ์ได้",
        level: "จำเป็นมาก (Must-have)",
      },
      {
        title: "พีชคณิตเชิงเส้น (Linear Algebra & Matrix)",
        desc: "เมทริกซ์และเวกเตอร์ที่ทำงานร่วมกับอนุพันธ์ย่อยในระบบหลายมิติ",
      },
    ],
    nextSteps: [
      {
        title: "แคลคูลัสหลายตัวแปร (Multivariable & Jacobians)",
        desc: "คำนวณความชันในมิติ N มิติสำหรับการเทรนโมเดล AI ขนาดใหญ่",
      },
      {
        title: "คณิตศาสตร์สำหรับ Machine Learning",
        desc: "การนำแคลคูลัสไปใช้ใน Backpropagation, Diffusion Model และ LLMs",
      },
    ],
    resources: [
      {
        title: "ซีรีส์ภาพจำลอง 3D: สัญชาตญาณของอนุพันธ์และปริพันธ์",
        desc: "อธิบายเชิงเรขาคณิตโดยไม่ต้องท่องจำสูตร",
        meta: "วิดีโอ • พื้นฐาน (Beginner)",
      },
      {
        title: "Gradient Descent: จาก SGD สู่ AdamW",
        desc: "บทความวิจัยเปรียบเทียบกลยุทธ์ปรับพารามิเตอร์ของ Deep Neural Networks",
        meta: "PDF • 18 หน้า • AI/Data Science",
      },
      {
        title: "Interactive Sandbox: PID Controller",
        desc: "ทดลองปรับค่า Kp, Ki, Kd บนแบบจำลองรถไร้คนขับ ดู Overshoot แบบ Real-time",
        meta: "Sandbox • เชิงโต้ตอบ",
      },
    ],
  },
  {
    id: "react",
    title: "การพัฒนาเว็บแอปด้วย React",
    desc: "เจาะลึกการทำงานของ React ภายใต้ประทุน กลไก Reconciliation ของ Virtual DOM กฎของ Immutability และการจัดการ Side Effects อย่างแม่นยำ",
    category: "วิศวกรรมเว็บและส่วนติดต่อผู้ใช้",
    level: "ปานกลาง (Intermediate)",
    duration: "6–8 ชั่วโมง",
    lessons: [
      {
        title: "1. บอกบท & แก่นแท้: ทำไม React ถึงคิดค้น Virtual DOM?",
        summary:
          "Real DOM หนักมาก การแตะบ่อยทำให้ Reflow/Repaint ช้า React ใช้ Virtual DOM (JS Object เบาๆ) + Diffing + Batch Update อัปเดตเฉพาะจุดที่เปลี่ยน พร้อมแยก Core Reconciler จนเอาไปเรนเดอร์เป็น Native/3D ได้",
      },
      {
        title: "2. Immutability, Closures และ Stale State",
        summary:
          "Immutability ทำให้เช็กความเปลี่ยนระดับ O(1) ส่วน Hooks อาศัย JS Closure จำ State ข้าม Render — เข้าใจผิดตรงนี้คือบ่อเกิดบั๊ก Stale Closure ใน useEffect",
      },
    ],
    prerequisites: [
      {
        title: "JavaScript Closures & Scope",
        desc: "React Hooks พึ่งพากลไก Closures ในการจำสถานะข้าม Render",
        level: "จำเป็นมาก (Must-have)",
      },
      {
        title: "DOM & การเรนเดอร์ของเบราว์เซอร์",
        desc: "เข้าใจ Real DOM, Reflow/Repaint ก่อนจึงจะเห็นคุณค่าของ Virtual DOM",
      },
    ],
    nextSteps: [
      {
        title: "React สู่ Full-Stack ด้วย Server Components",
        desc: "ต่อยอด React สู่ Full-Stack Framework ยุคใหม่",
      },
      {
        title: "State ระดับองค์กร (Zustand & Redux Toolkit)",
        desc: "สถาปัตยกรรม Global State และ Predictable Mutation",
      },
    ],
    resources: [
      {
        title: "เจาะลึก Virtual DOM และ Fiber Reconciler (React 18/19)",
        desc: "วิดีโอวิเคราะห์ซอร์สโค้ด: Linked List ของ Fiber Nodes และ Time Slicing",
        meta: "วิดีโอ • 48 นาที",
      },
    ],
  },
  {
    id: "genetics",
    title: "พันธุศาสตร์ระดับโมเลกุล",
    desc: "ทำความเข้าใจการถอดรหัส DNA เป็น mRNA สู่โปรตีน และวิธีที่มนุษย์นำความรู้นี้ไปสร้างสิ่งประดิษฐ์ทางการแพทย์ที่เปลี่ยนโลก เช่น วัคซีน mRNA และการตัดต่อยีน CRISPR",
    category: "วิทยาศาสตร์ชีวภาพและเทคโนโลยีการแพทย์",
    level: "ขั้นสูง (Advanced)",
    duration: "7–9 ชั่วโมง",
    lessons: [
      {
        title: "1. บอกบท & แก่นแท้: Central Dogma และภาษา 4 ตัวอักษร",
        summary:
          "DNA คือ Hard Drive, mRNA คือ RAM, โปรตีนคือเครื่องจักร ตัวอย่างจริง: วัคซีน mRNA (BioNTech/Moderna) ใช้ LNP ส่งคำสั่งให้ร่างกายผลิตแอนติบอดีเอง, CRISPR-Cas9 ใช้ Guide RNA นำทางตัด DNA จำเพาะจุด",
      },
      {
        title: "2. จากโนเบลสู่คลินิก: Pseudouridine & CRISPR",
        summary:
          "การดัดแปลง Uridine → Pseudouridine (Karikó & Weissman) ทำให้ mRNA รอดจากภูมิคุ้มกันดั้งเดิม และกลไก CRISPR ในการรักษาโรคทางพันธุกรรม",
      },
    ],
    prerequisites: [
      {
        title: "ชีววิทยาเซลล์ (Cell Biology & Organelles)",
        desc: "เข้าใจบทบาทของนิวเคลียส ไรโบโซม และโครงสร้างโมเลกุลชีวภาพ",
        level: "จำเป็นมาก (Must-have)",
      },
      {
        title: "ชีวสารสนเทศศาสตร์ (Bioinformatics)",
        desc: "การใช้อัลกอริทึมวิเคราะห์ลำดับเบส DNA มนุษย์",
      },
    ],
    nextSteps: [
      {
        title: "เทคโนโลยี CRISPR-Cas9 ระดับคลินิก",
        desc: "การใช้ Guide RNA ตรวจจับเบสกลายพันธุ์ในผู้ป่วยโรคทางพันธุกรรม",
      },
      {
        title: "การรักษามะเร็งและโรคธาลัสซีเมีย",
        desc: "การประยุกต์วิศวกรรมพันธุศาสตร์สู่การรักษาโรคจริง",
      },
    ],
    resources: [
      {
        title: "คู่มือวิศวกรรมพันธุศาสตร์: CRISPR-Cas9 ระดับคลินิก",
        desc: "บทความวิชาการแพทย์ เจาะลึก Guide RNA กับการรักษาโรคทางพันธุกรรม",
        meta: "บทความ • 24 หน้า",
      },
    ],
  },
];

import { MS_SUBJECTS } from "./ms-curriculum";

export const ALL_SUBJECTS: Subject[] = [...SUBJECTS, ...MS_SUBJECTS];

export function getSubject(id: string): Subject | undefined {
  return ALL_SUBJECTS.find((s) => s.id === id);
}
