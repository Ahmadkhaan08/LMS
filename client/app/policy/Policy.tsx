
const Policy = () => {
  return (
    <div>
      <div className="w-[95%] 800px:w-[92%] m-auto py-6 text-black dark:text-white px-3 font-Poppins ">

        <h1 className={`text-[25px] font-[500] bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 !text-start pt-2`}>
          Platform Terms & Policies
        </h1>

        <p className="text-[16px] mt-2 text-gray-600 dark:text-gray-300">
          These policies outline how we operate our platform, protect your data,
          and ensure a safe and fair learning environment for all users.
        </p>

        {/* Privacy Policy */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            1. Privacy Policy
          </h2>
          <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-300 ml-4">
            We collect essential information such as your name, email, course progress,
            and payment details to provide a personalized learning experience.
            This data helps us improve platform performance and recommend relevant content.
            We may use cookies and analytics tools to understand user behavior.
            Your data is securely stored, and you retain full rights to access,
            update, or request deletion of your personal information.
          </p>
        </div>

        {/* Terms */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            2. Terms of Service
          </h2>
          <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-300 ml-4">
            By using our platform, you agree to maintain account security and follow
            our community guidelines. Purchases and subscriptions are subject to
            defined pricing and refund conditions. Sharing course materials,
            engaging in fraud, or violating platform rules may result in account
            suspension or termination.
          </p>
        </div>

        {/* Refund */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            3. Refund Policy
          </h2>
          <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-300 ml-4">
            Refunds are available within 7 days of purchase, provided that less than
            20% of the course has been completed. Refunds do not apply to downloadable
            content or cases of change of mind unless a technical issue occurs from
            our side.
          </p>
        </div>

        {/* Honor Code */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            4. Honor Code
          </h2>
          <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-300 ml-4">
            We expect all learners to maintain academic honesty. Plagiarism, cheating,
            or unauthorized sharing of content is strictly prohibited and may result
            in account suspension or loss of certification.
          </p>
        </div>

        {/* Accessibility */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            5. Accessibility
          </h2>
          <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-300 ml-4">
            We are committed to making our platform accessible to everyone. We follow
            modern accessibility standards (WCAG 2.1) and aim to support screen readers,
            captions, and inclusive learning experiences wherever possible.
          </p>
        </div>

        {/* Community */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            6. Community Guidelines
          </h2>
          <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-300 ml-4">
            Respectful communication is required at all times. Harassment, hate speech,
            spam, or irrelevant promotions are not allowed. We aim to maintain a safe
            and supportive learning environment for all users.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 mb-2">
            7. Copyright Policy
          </h2>
          <p className="text-[16px] leading-7 text-gray-700 dark:text-gray-300 ml-4">
            All content on this platform is owned by ELearning or its instructors.
            Unauthorized copying, downloading, or redistribution is strictly prohibited.
            If you believe your rights have been violated, contact our support team.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Policy;