"use client";

import React from "react";

import TextField from "@/components/form/textfield";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import useLogin from "./useLogin";

export default function Login() {
  /*======================== Props ======================== */

  const {
    email,
    password,
    errors,
    isLoading,
    handleChangeValue,
    handleSubmit,
    handleLoginSso,
  } = useLogin();

  /*======================== Return ======================== */

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => handleLoginSso("google")}
        disabled={isLoading}
        className="bg-primary-foreground border-outline-variant/15 hover:bg-surface-container-highest flex w-full items-center justify-center gap-3 rounded-lg border px-6 py-4 font-medium transition-all duration-300 active:scale-95 disabled:opacity-50"
      >
        <Image src="/icon/google.svg" alt="" width={20} height={20} />
        <span>Masuk dengan Google</span>
      </button>

      <div className="relative flex items-center py-2">
        <div className="border-outline-variant/70 flex-grow border-t" />
        <span className="mx-4 shrink text-xs tracking-widest text-(--outline) uppercase">
          Atau Masuk dengan
        </span>
        <div className="border-outline-variant/70 flex-grow border-t" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium tracking-wider text-(--outline) uppercase">
          Email
        </label>
        <TextField
          name="email"
          placeholder="email@tikita.id"
          type="email"
          value={email}
          onChange={(e) => handleChangeValue("email", e.target.value)}
          onEnterPress={handleSubmit}
          error={errors.email}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium tracking-wider text-(--outline) uppercase">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="hover:text-primary-container text-primary text-xs font-medium transition-colors"
          >
            Lupa password?
          </Link>
        </div>
        <TextField
          name="password"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => handleChangeValue("password", e.target.value)}
          onEnterPress={handleSubmit}
          error={errors.password}
          disabled={isLoading}
        />
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="h-auto w-full rounded-lg py-4 font-bold"
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Masuk
        </Button>
      </div>
    </div>
  );
}
