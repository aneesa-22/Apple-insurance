import SimpleInsuranceContactPage from "../../components/forms/SimpleInsuranceContactPage";

export default function CarInsurancePage() {
  return (
    <SimpleInsuranceContactPage
      enquiryType="Car Insurance"
      eyebrow="Car Insurance"
      heading="Car insurance enquiries"
      intro="Tell us what cover you need and our team will help point your car insurance enquiry in the right direction."
      partnerQuote={{
        title: "Need an instant car quote?",
        copy: "If you want an instant quote right now, you can use our trusted partner to compare car insurance options online.",
        buttonLabel: "Get an instant quote",
        href: "https://www.quotezone.co.uk/SetAffiliate.php?aid=H5R6W9-001&type=car",
        note: "* Clicking this link will take you to a third-party website.",
        followUp:
          "If you’d rather speak to us directly, fill out the contact form below and we’ll get in touch with you.",
      }}
    />
  );
}
