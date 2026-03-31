import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  /** Resolved light/dark (follows OS when theme is `system`). */
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

function resolveAppearance(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "destino-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
    "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;

    const apply = () => {
      const resolved = resolveAppearance(theme);
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    apply();

    if (theme !== "system") {
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSchemeChange = () => {
      const resolved = resolveAppearance("system");
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    mq.addEventListener("change", onSchemeChange);
    return () => mq.removeEventListener("change", onSchemeChange);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (next: Theme) => {
      localStorage.setItem(storageKey, next);
      setTheme(next);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === null)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
