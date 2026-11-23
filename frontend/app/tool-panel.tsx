"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type ToolDetail = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "available" | "lent" | "unavailable";
  owner: { firstName: string; district: string } | null;
};

const statusLabel = { available: "Disponible", lent: "Prêté", unavailable: "Indisponible" };

// Transforme une réponse d'erreur de l'API en phrase lisible.
async function apiError(res: Response) {
  let detail = "";
  try {
    const body = await res.json();
    detail = body.error ?? "";
  } catch {
    // réponse sans JSON
  }
  const prefix: Record<number, string> = {
    400: "Demande invalide",
    403: "Action non autorisée",
    404: "Introuvable",
    409: "Impossible",
  };
  return `${prefix[res.status] ?? `Erreur ${res.status}`}${detail ? ` : ${detail}` : ""}`;
}

export function ToolPanel({
  toolId,
  userId,
  onClose,
}: {
  toolId: string;
  userId: string;
  onClose: () => void;
}) {
  const [tool, setTool] = useState<ToolDetail | null>(null);
  const [loadError, setLoadError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  // Fiche de l'outil (US-03 : GET /api/tools/:id).
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/tools/${toolId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await apiError(res));
        return res.json() as Promise<ToolDetail>;
      })
      .then((data) => !cancelled && setTool(data))
      .catch((err: Error) => !cancelled && setLoadError(err.message));
    return () => {
      cancelled = true;
    };
  }, [toolId]);

  // Demande d'emprunt (US-04 : POST /api/loans).
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!userId) {
      setMessage({ kind: "error", text: "Choisissez d'abord votre profil en haut de la page." });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-User-Id": userId },
        body: JSON.stringify({ toolId, startDate, endDate }),
      });
      if (!res.ok) {
        setMessage({ kind: "error", text: await apiError(res) });
      } else {
        setMessage({ kind: "ok", text: "Demande envoyée : elle est en attente de réponse du propriétaire." });
      }
    } catch {
      setMessage({ kind: "error", text: "L'API ne répond pas." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="panel-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="tool-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Fiche de l'outil"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="panel-close" type="button" onClick={onClose} aria-label="Fermer">×</button>

        {loadError && <p className="panel-message error">{loadError}</p>}
        {!tool && !loadError && <p>Chargement de la fiche...</p>}

        {tool && (
          <>
            <p className="panel-category">{tool.category}</p>
            <h3>{tool.name}</h3>
            <span className={`available-tag status-${tool.status}`}><span /> {statusLabel[tool.status]}</span>
            <p className="panel-description">{tool.description || "Pas de description."}</p>
            {tool.owner && (
              <p className="panel-owner">
                Prêté par <strong>{tool.owner.firstName}</strong>, quartier {tool.owner.district}
              </p>
            )}

            <form className="loan-form" onSubmit={handleSubmit}>
              <label>
                Du
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </label>
              <label>
                Au
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </label>
              <button className="button button-dark" type="submit" disabled={sending}>
                {sending ? "Envoi..." : "Demander l'emprunt"}
              </button>
            </form>

            {message && <p className={`panel-message ${message.kind}`} role="status">{message.text}</p>}
          </>
        )}
      </aside>
    </div>
  );
}
