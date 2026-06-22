import { styles } from "../styles/style";

const About = () => {
  return (
    <div className="text-black dark:text-white font-Poppins">
      <br />
      <h1 className={`${styles.title} 800px:!text-[45px]`}>
        About <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">ELearning</span>
      </h1>
      <br />

      <div className="w-[95%] 800px:w-[85%] m-auto">
        <p className="text-[18px] font-Poppins leading-8 text-center">
          At ELearning, our mission is to make quality education accessible,
          practical, and affordable for everyone. We are a modern online
          learning platform built to help students, developers, and
          professionals gain real-world skills and stay ahead in today’s
          competitive digital world.
          <br />
          <br />
          We understand that learning can often feel overwhelming, especially
          when starting a new journey in technology. That’s why we focus on
          simplifying complex topics into structured, easy-to-follow lessons
          designed for learners at every level — from beginners to advanced
          professionals.
          <br />
          <br />
          Our platform offers carefully designed courses in programming,
          software development, and modern technologies. Each course is created
          with a practical approach, combining theory with hands-on projects so
          students can build confidence while learning.
          <br />
          <br />
          Beyond courses, ELearning is a growing community where learners can
          ask questions, share knowledge, and connect with like-minded
          individuals. We believe that learning is stronger when it happens
          together.
          <br />
          <br />
          Our goal is not just to teach skills, but to empower people to build
          careers, launch ideas, and create opportunities for themselves. By
          focusing on affordability, quality, and continuous improvement, we aim
          to bridge the gap between education and industry demands.
          <br />
          <br />
          At ELearning, we are committed to helping you learn, grow, and succeed
          — one step at a time.
        </p>

        <br />

        <div className="flex flex-col items-center justify-center">
          <span className="text-[22px]  ">Mohammad Ahmad Khan</span>
          <h5 className="text-[18px] font-Poppins bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600">
            Founder & CEO of ELearning
          </h5>
        </div>

        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};

export default About;
