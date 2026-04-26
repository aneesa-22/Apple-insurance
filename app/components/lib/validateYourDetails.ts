import type { YourDetailsFormData } from "../forms/YourDetailsStep";


export type YourDetailsErrors = Partial<
  Record<keyof YourDetailsFormData, string>
>;

const isValidUkPhone = (phone: string) =>
  /^(?:\+44|0044|0)\d{9,10}$/.test(phone.replace(/[\s()-]/g, ""));

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

const isValidPostcode = (postcode: string) =>
  /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode);

const isValidName = (value: string) =>
  /^[A-Za-zÀ-ÿ' -]+$/.test(value.trim());

const isPastDate = (dateValue: string) => {
  const date = new Date(`${dateValue}T00:00:00`);
  const today = new Date();

  today.setHours(23, 59, 59, 999);

  return !Number.isNaN(date.getTime()) && date <= today;
};

const getAge = (dateString: string) => {
  const today = new Date();
  const dob = new Date(dateString);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
};

const isAtLeast21 = (dateString: string) => {
  if (!dateString) return false;

  const dob = new Date(dateString);
  if (Number.isNaN(dob.getTime())) return false;

  return getAge(dateString) >= 21;
};

export default function validateYourDetails(
  formData: YourDetailsFormData
): YourDetailsErrors {
  const errors: YourDetailsErrors = {};

  if (!formData.title) {
    errors.title = "Please select your title.";
  }

  if (!formData.firstName.trim()) {
    errors.firstName = "Please enter your first name.";
  } else if (
    formData.firstName.trim().length < 2 ||
    !isValidName(formData.firstName)
  ) {
    errors.firstName = "Please enter a valid first name.";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Please enter your last name.";
  } else if (
    formData.lastName.trim().length < 2 ||
    !isValidName(formData.lastName)
  ) {
    errors.lastName = "Please enter a valid last name.";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (!isValidUkPhone(formData.phone)) {
    errors.phone = "Please enter a valid UK phone number.";
  }

  if (!formData.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!formData.dateOfBirth) {
    errors.dateOfBirth = "Please enter your date of birth.";
  } else if (!isPastDate(formData.dateOfBirth)) {
    errors.dateOfBirth = "Please enter a valid date of birth.";
  } else if (!isAtLeast21(formData.dateOfBirth)) {
    errors.dateOfBirth = "We’re currently unable to offer cover for people under 21. You may wish to try a specialist provider.";
  }

  if (!formData.maritalStatus) {
    errors.maritalStatus = "Please select your marital status.";
  }

  if (!formData.addressLine1.trim()) {
    errors.addressLine1 = "Please enter the first line of your address.";
  }

  if (!formData.postcode.trim()) {
    errors.postcode = "Please enter your postcode.";
  } else if (!isValidPostcode(formData.postcode)) {
    errors.postcode = "Please enter a valid UK postcode.";
  }

  return errors;
}
