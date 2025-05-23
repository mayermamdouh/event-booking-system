// import { useCallback, useContext, useState } from "react";
// import InputField from "../components/InputField";
// import Loading from "../components/Loading";
// import axios from "axios";
// import VerifyEmail from "../components/verfiyEmail";
// import { useDispatch } from "react-redux";

import { useCallback, useState } from "react";
import InputField from "../components/InputField";
import Loading from "../components/Loading";
import axios from "axios";
import { Auth } from "../context/authContext";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const { login, setMessage } = Auth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName || formData.firstName.length < 3) {
      newErrors.firstName = "First Name must be at least 3 characters.";
    }

    if (!formData.lastName || formData.lastName.length < 3) {
      newErrors.lastName = "Last Name must be at least 3 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else {
      const upperCasePattern = /[A-Z]/;
      const numberPattern = /\d/;
      const specialCharPattern = /[@$!%*?&]/;
      if (!upperCasePattern.test(formData.password)) {
        newErrors.password =
          "Password must include at least one uppercase letter.";
      } else if (!numberPattern.test(formData.password)) {
        newErrors.password = "Password must include at least one number.";
      } else if (!specialCharPattern.test(formData.password)) {
        newErrors.password =
          "Password must include at least one special character (@$!%*?&).";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:3001/users/register`,
          formData
        );

        if (response.data.status === "success") {
          login(response.data.data.user.token);
          setMessage("You have successfully logged in.");
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        const errorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Something went wrong!";
        setErrors({ form: errorMessage });
      }
    },
    [validateForm, formData, login, setMessage]
  );

  if (loading) return <Loading />;

  return (
    <>
      {/* {register && <VerifyEmail email={userData?.data?.user?.email} />} */}
      <form onSubmit={handleSubmit}>
        {errors.form && <p className="error">{errors.form}</p>}
        <div className="flex flex-col gap-5 items-center ">
          <div className="flex flex-col w-full text-right">
            <InputField
              labelName={t("first_name")}
              onChange={(value) => {
                handleFormDataChange("firstName", value);
              }}
              type="text"
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>
          <div className="flex flex-col w-full text-right">
            <InputField
              labelName={t("last_name")}
              onChange={(value) => {
                handleFormDataChange("lastName", value);
              }}
              type="text"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName}</p>
            )}
          </div>

          <div className="flex flex-col w-full text-right">
            <InputField
              labelName={t("email")}
              onChange={(value) => {
                handleFormDataChange("email", value);
              }}
              type="email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className="flex flex-col w-full text-right">
            <InputField
              labelName={t("password")}
              onChange={(value) => {
                handleFormDataChange("password", value);
              }}
              type="password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button className="w-[30%]" type="submit">
            {t("create_account")}
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUp;
