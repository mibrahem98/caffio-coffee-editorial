import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

function clearPreviewSessionToken() {
  try {
    window.sessionStorage.removeItem("manus-cookie");
  } catch (error) {
    if (import.meta.env.DEV) console.warn("[Auth] Unable to clear preview session token", error);
  }
}

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") return;
      throw error;
    } finally {
      clearPreviewSessionToken();
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const user = meQuery.data ?? null;
  const loading = meQuery.isLoading || logoutMutation.isPending;
  const error = meQuery.error ?? logoutMutation.error ?? null;

  useEffect(() => {
    if (!redirectOnUnauthenticated || loading || user || typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;
    if (redirectPath) window.location.href = redirectPath;
    else startLogin();
  }, [loading, redirectOnUnauthenticated, redirectPath, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    refresh: () => meQuery.refetch(),
    logout,
  };
}
