"use client";

import { useState } from "react";
import {
  Database,
  ExternalLink,
  Copy,
  Check,
  Code,
  BookOpen,
} from "lucide-react";
import {
  datasets,
  spectralIndices,
  geeCodeSnippets,
  researchReferences,
} from "@/data/datasets";

export default function DatasetsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"datasets" | "indices" | "code">(
    "datasets",
  );

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Database className="text-[var(--primary)]" />
              Verified Dataset Catalog
            </h1>
            <p className="text-[var(--muted)] mt-2">
              Google Earth Engine datasets • Research references • GEE code
              snippets
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("datasets")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "datasets"
                ? "bg-[var(--primary)] text-white"
                : "glass-card hover:bg-white/10"
            }`}
          >
            <Database className="w-4 h-4" />
            GEE Datasets ({datasets.length})
          </button>
          <button
            onClick={() => setActiveTab("indices")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "indices"
                ? "bg-[var(--primary)] text-white"
                : "glass-card hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Spectral Indices ({spectralIndices.length})
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "code"
                ? "bg-[var(--primary)] text-white"
                : "glass-card hover:bg-white/10"
            }`}
          >
            <Code className="w-4 h-4" />
            GEE Code ({geeCodeSnippets.length})
          </button>
        </div>

        {/* Datasets Tab */}
        {activeTab === "datasets" && (
          <div className="space-y-4">
            {datasets.map((ds) => (
              <div key={ds.id} className="glass-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{ds.name}</h3>
                      <span className="badge badge-primary">{ds.provider}</span>
                      <span className="badge">{ds.color}</span>
                    </div>
                    <p className="text-[var(--muted)] text-sm mb-4">
                      {ds.description}
                    </p>

                    {/* GEE Catalog ID */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-[var(--muted)]">
                        Catalog ID:
                      </span>
                      <code className="bg-black/40 px-3 py-1 rounded text-sm font-mono text-[var(--primary)]">
                        {ds.gee_id}
                      </code>
                      <button
                        onClick={() => copyToClipboard(ds.gee_id, ds.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Copy ID"
                      >
                        {copiedId === ds.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--muted)]" />
                        )}
                      </button>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-[var(--muted)]">Resolution</span>
                        <p className="font-medium">{ds.resolution}</p>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">Revisit</span>
                        <p className="font-medium">{ds.revisit}</p>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">Coverage</span>
                        <p className="font-medium">{ds.coverage}</p>
                      </div>
                      <div>
                        <span className="text-[var(--muted)]">Usage</span>
                        <p className="font-medium text-xs">
                          {ds.use_case.slice(0, 50)}...
                        </p>
                      </div>
                    </div>

                    {/* Bands */}
                    {ds.bands && (
                      <div className="mt-4">
                        <span className="text-xs text-[var(--muted)]">
                          Key Bands:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {ds.bands.map((band) => (
                            <span
                              key={band}
                              className="px-2 py-0.5 bg-white/5 border border-[var(--border)] rounded text-xs"
                            >
                              {band}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex flex-col gap-2 ml-4">
                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 glass-card hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      GEE Catalog
                    </a>
                    {ds.gee_code_url && (
                      <a
                        href={ds.gee_code_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 glass-card hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Code className="w-4 h-4" />
                        GEE Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Research References */}
            <div className="glass-card p-6 mt-8">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                Research References
              </h3>
              <div className="space-y-3">
                {researchReferences.map((ref, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white/5 border border-[var(--border)] rounded-lg"
                  >
                    <p className="font-medium text-sm">{ref.title}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {ref.authors}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-[var(--muted)]">
                        DOI:{" "}
                        <code className="text-[var(--primary)]">{ref.doi}</code>
                      </span>
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Spectral Indices Tab */}
        {activeTab === "indices" && (
          <div className="grid grid-cols-2 gap-6">
            {spectralIndices.map((idx) => (
              <div key={idx.id} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-bold text-lg">{idx.name}</h3>
                  <span className="badge badge-primary">{idx.acronym}</span>
                </div>
                <p className="text-[var(--muted)] text-sm mb-4">
                  {idx.description}
                </p>

                {/* Formula */}
                <div className="bg-black/40 p-4 rounded-lg mb-4">
                  <p className="font-mono text-center text-lg">{idx.formula}</p>
                </div>

                {/* Bands */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  {Object.entries(idx.bands).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[var(--muted)]">{key}</span>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Thresholds */}
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-xs text-[var(--muted)] mb-2">
                    Interpretation:
                  </p>
                  <div className="space-y-1 text-xs">
                    {idx.thresholds.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        <span className="text-[var(--muted)]">{t.range}:</span>
                        <span>{t.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[var(--muted)] mt-4">
                  Reference: {idx.reference}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* GEE Code Tab */}
        {activeTab === "code" && (
          <div className="space-y-6">
            {geeCodeSnippets.map((snippet) => (
              <div key={snippet.id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{snippet.title}</h3>
                    <p className="text-[var(--muted)] text-sm">
                      {snippet.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(snippet.code, `code-${snippet.id}`)
                      }
                      className="px-3 py-1 glass-card hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                    >
                      {copiedId === `code-${snippet.id}` ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                    {snippet.gee_link && (
                      <a
                        href={snippet.gee_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 glass-card hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in GEE
                      </a>
                    )}
                  </div>
                </div>

                {/* Code Block */}
                <div className="bg-black/60 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-[var(--border)]">
                    <span className="text-xs text-[var(--muted)]">
                      JavaScript (GEE)
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {snippet.usage}
                    </span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm">
                    <code className="text-green-300">{snippet.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
