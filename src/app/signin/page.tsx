"use client";

import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();

  const handleGoogleLoginSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const googleToken = credentialResponse.credential;

      if (!googleToken) return toast.error("Google token not found");

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        {
          token: googleToken,
        }
      );

      toast.success("Verified Sucessfully");
      if (verifyGoogleToken) {
        window.localStorage.setItem("googleToken", verifyGoogleToken);
      }

      router.push("/");
    },
    []
  );

  useEffect(() => {
    if (window.localStorage.getItem("googleToken")) router.push("/");
  }, []);

  const handleGoogleLoginFailure = () => {
    console.error("Google login failed:");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          Sign in to Your Account
        </h2>
        <p className="text-center text-gray-600">
          Sign in using your Google account
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            text="signin_with"
            shape="rectangular"
            size="large"
            width="250px"
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
