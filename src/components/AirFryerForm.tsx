import React, { useState } from "react";
import "./AirFryerForm.css";
import NetworkBg from "./NetworkBg";

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  costGuess: string;
  spidrPin: string;
}

const AirFryerForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    costGuess: "",
    spidrPin: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^[+]?[1-9][\d]{0,15}$/.test(
        formData.phoneNumber.replace(/[\s\-()]/g, "")
      )
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.costGuess.trim()) {
      newErrors.costGuess = "Cost guess is required";
    } else if (!/^\$?\d+(\.\d{2})?$/.test(formData.costGuess)) {
      newErrors.costGuess = "Please enter a valid dollar amount";
    }

    if (!formData.spidrPin.trim()) {
      newErrors.spidrPin = "Spidr PIN is required";
    } else if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(formData.spidrPin)) {
      newErrors.spidrPin = "Please enter PIN in format: ####-####-####-####";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Only allow digits for phone number and max 10 digits
    if (name === "phoneNumber") {
      newValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    // Only allow up to 2 decimal places for costGuess
    if (name === "costGuess") {
      // Allow only numbers and decimal
      newValue = value.replace(/[^0-9.]/g, "");
      // Only one decimal point
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = parts[0] + "." + parts.slice(1).join("");
      }
      // Restrict to 2 decimal places
      if (parts[1]) {
        newValue = parts[0] + "." + parts[1].slice(0, 2);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const formatSpidrPin = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format as ####-####-####-####
    if (digits.length <= 4) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    if (digits.length <= 12)
      return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(
      8,
      12
    )}-${digits.slice(12, 16)}`;
  };

  const handleSpidrPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatSpidrPin(value);

    setFormData((prev) => ({
      ...prev,
      spidrPin: formatted,
    }));

    if (errors.spidrPin) {
      setErrors((prev) => ({
        ...prev,
        spidrPin: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted with data:", formData);
      alert("Thank you for your interest! Check the console for form data.");
    }
  };

  return (
    <>
      <div className="air-fryer-form-bg">
        <NetworkBg />
      </div>
      <div className="air-fryer-form-container">
        <div className="form-header">
          <h2>Get Your Spidr Air Fryer</h2>
          <p>Join the revolution in air frying technology</p>
        </div>

        <form onSubmit={handleSubmit} className="air-fryer-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={errors.firstName ? "error" : ""}
                placeholder="first name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={errors.lastName ? "error" : ""}
                placeholder="last name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={errors.phoneNumber ? "error" : ""}
                placeholder="phone number"
                inputMode="numeric"
                pattern="[0-9]*"
                minLength={10}
                maxLength={15}
              />
              {errors.phoneNumber && (
                <span className="error-message">{errors.phoneNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
                placeholder="email address"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="costGuess">Guess the Air Fryer's $ *</label>
              <input
                type="number"
                id="costGuess"
                name="costGuess"
                value={formData.costGuess}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={errors.costGuess ? "error" : ""}
                placeholder="$299.99"
                min="0"
                step="0.01"
              />
              {errors.costGuess && (
                <span className="error-message">{errors.costGuess}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="spidrPin">Spidr PIN *</label>
              <input
                type="text"
                id="spidrPin"
                name="spidrPin"
                value={formData.spidrPin}
                onChange={handleSpidrPinChange}
                className={errors.spidrPin ? "error" : ""}
                placeholder="1234-5678-9012-3456"
                maxLength={19}
              />
              {errors.spidrPin && (
                <span className="error-message">{errors.spidrPin}</span>
              )}
            </div>
          </div>

          <div className="form-submit">
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AirFryerForm;
