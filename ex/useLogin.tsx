import { useState } from "react";

import { useToaster } from "@/components/toaster/use-toaster";
import { IError } from "@/queries/Interfaces";
import { useQueryLogin } from "@/queries/auth/authQueries";
import useGlobalStore from "@/store/global/globalStore";
import useUserStore from "@/store/user/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

const useLogin = () => {
  /*======================== Props ======================== */

  const router = useRouter();
  const { success } = useToaster();

  /*======================== UseState ======================== */

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  /*======================== Queries ======================== */

  const { mutateAsync: login, isPending } = useQueryLogin();

  /*======================== Store ======================== */

  const setUserState = useUserStore((state) => state.setState);
  const setStatusModal = useGlobalStore((state) => state.setStatusModal);

  /*======================== Handler ======================== */

  const handleChangeValue = (type: "email" | "password", value: string) => {
    if (type === "email") {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (type === "password") {
      setPassword(value);
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };
  const handleSubmit = async () => {
    // dismiss("login-error");
    const nextErrors: typeof errors = {};
    if (!email) nextErrors.email = "Email tidak boleh kosong.";
    else if (!isValidEmail(email))
      nextErrors.email =
        "Email tidak valid. Silakan periksa kembali email Anda.";
    if (!password) nextErrors.password = "Password tidak boleh kosong.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      try {
        const response = await login({
          email,
          password,
        });
        setUserState("isAuthenticated", true);
        success({
          id: "login-success",
          duration: 5000,
          closeButton: true,
          customContent: (
            <>
              <Image src="/icon/hi-hand.svg" alt="hi" width={24} height={24} />
              <p className="flex-1 text-sm">
                Selamat datang kembali {response.data.name}!
              </p>
            </>
          ),
        });
        router.push("/");
      } catch (e) {
        const err = e as IError;
        setStatusModal({
          isOpen: true,
          title: "Login Gagal",
          description: err.message ?? "Coba lagi.",
          closeLabel: "Tutup",
          variant: "error",
        });
        // error({
        //   id: "login-error",
        //   description: err.message ?? "Login failed, please try again.",
        //   duration: 5000,
        //   closeButton: true,
        // });
      }
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLoginSso = async (type: "google" | "meta") => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    window.open(`${baseUrl}/auth/login/${type}`, "_self");
  };

  /*======================== Return ======================== */

  return {
    email,
    password,
    errors,
    isLoading: isPending,
    handleChangeValue,
    handleSubmit,
    handleLoginSso,
  };
};

export default useLogin;
