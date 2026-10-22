import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BricoLoop — Les bons outils sont juste à côté",
  description:
    "Empruntez les outils de vos voisins et faites vivre votre quartier. Perceuse, ponceuse, taille-haie : partagez plutôt qu'acheter.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
