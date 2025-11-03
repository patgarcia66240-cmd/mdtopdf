import { useState } from "react";
import { useExport } from "./hooks/api/useExport"; // 🔥 Hook d’export serverless TanStack
import InputWithButton from "./components/ui/InputWithButton";
import TemplateCard from "./components/ui/TemplateCard";
import {
  DocumentIcon,
  Cog6ToothIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  GlobeAltIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

function App() {
  // ----- États principaux -----
  const [activeTab, setActiveTab] = useState("options");
  const [content, setContent] = useState(
    "# Bienvenue dans MDtoPDF\n\nCeci est un convertisseur Markdown vers PDF moderne."
  );
  const [isDark, setIsDark] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("Mon Document");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  // ----- Hook d’export (TanStack Query) -----
  const exportMutation = useExport();

  // ----- Actions -----
  const handleExport = (format: "pdf" | "html" | "md") => {
    exportMutation.mutate({
      markdown: content,
      format,
      fileName: documentTitle,
    });
  };

  const handleTitleSubmit = () => {
    if (documentTitle.trim()) {
      alert(`Titre du document: ${documentTitle}`);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleTemplateCustomize = () => {
    alert("Personnalisation du template - fonctionnalité à venir");
  };

  // ----- Styles -----
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
    color: isDark ? "#ffffff" : "#333333",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  };

  const tabContainer = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    backgroundColor: isDark ? "#333" : "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  };

  const tabStyle = (isActive: boolean) => ({
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: isActive
      ? isDark
        ? "#4a5568"
        : "#e5e7eb"
      : "transparent",
    color: isDark ? "#fff" : "#333",
    fontSize: "16px",
    fontWeight: isActive ? "bold" : "normal",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const contentBox = {
    backgroundColor: isDark ? "#2a2a2a" : "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    minHeight: "400px",
  };

  const buttonStyle = {
    padding: "15px 30px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "200px",
    padding: "15px",
    border: `1px solid ${isDark ? "#4a5568" : "#d1d5db"}`,
    borderRadius: "8px",
    backgroundColor: isDark ? "#374151" : "#fff",
    color: isDark ? "#fff" : "#333",
    fontSize: "14px",
    fontFamily: "monospace",
    resize: "vertical" as const,
    marginBottom: "20px",
  };

  // ----- Rendu -----
  return (
    <div style={containerStyle}>
      {/* --- Header --- */}
      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          marginBottom: "30px",
        }}
      >
        <DocumentIcon
          style={{
            width: "28px",
            height: "28px",
            verticalAlign: "middle",
            marginRight: "8px",
          }}
        />
        MDtoPDF Converter
      </h1>

      {/* --- Bouton thème --- */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            padding: "10px 20px",
            backgroundColor: isDark ? "#4a5568" : "#e5e7eb",
            border: "none",
            borderRadius: "20px",
            color: isDark ? "#fff" : "#333",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: "0 auto",
          }}
        >
          {isDark ? (
            <>
              <SunIcon style={{ width: "18px", height: "18px" }} />
              Mode Clair
            </>
          ) : (
            <>
              <MoonIcon style={{ width: "18px", height: "18px" }} />
              Mode Sombre
            </>
          )}
        </button>
      </div>

      {/* --- Navigation --- */}
      <div style={tabContainer}>
        <button
          onClick={() => setActiveTab("options")}
          style={tabStyle(activeTab === "options")}
        >
          <Cog6ToothIcon
            style={{ width: "18px", height: "18px", marginRight: "6px" }}
          />
          Options
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          style={tabStyle(activeTab === "templates")}
        >
          <SparklesIcon
            style={{ width: "18px", height: "18px", marginRight: "6px" }}
          />
          Templates
        </button>
        <button
          onClick={() => setActiveTab("export")}
          style={tabStyle(activeTab === "export")}
        >
          <GlobeAltIcon
            style={{ width: "18px", height: "18px", marginRight: "6px" }}
          />
          Export
        </button>
      </div>

      {/* --- Contenu principal --- */}
      <div style={contentBox}>
        {activeTab === "options" && (
          <div>
            <h2 style={{ color: isDark ? "#fff" : "#333" }}>Options PDF</h2>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: isDark ? "#9ca3af" : "#6b7280",
                  fontWeight: "500",
                }}
              >
                Nom du document :
              </label>
              <InputWithButton
                value={documentTitle}
                onChange={setDocumentTitle}
                onButtonClick={handleTitleSubmit}
                placeholder="Entrez votre titre"
                buttonText="Continuer"
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: isDark ? "#9ca3af" : "#6b7280",
                  fontWeight: "500",
                }}
              >
                Choisissez un template :
              </label>

              <TemplateCard
                title="Moderne"
                description="Template moderne et épuré avec des couleurs douces"
                previewColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                isPro={false}
                isSelected={selectedTemplate === "modern"}
                onSelect={() => handleTemplateSelect("modern")}
                onCustomize={handleTemplateCustomize}
              />

              <TemplateCard
                title="Académique"
                description="Template formel pour documents académiques"
                previewColors={["#1e293b", "#475569", "#64748b"]}
                isPro={true}
                isSelected={selectedTemplate === "academic"}
                onSelect={() => handleTemplateSelect("academic")}
                onCustomize={handleTemplateCustomize}
              />
            </div>

            <button
              onClick={() => handleExport("pdf")}
              style={buttonStyle}
              disabled={exportMutation.isPending}
            >
              <DocumentArrowDownIcon
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              />
              {exportMutation.isPending ? "Export..." : "Exporter en PDF"}
            </button>
          </div>
        )}

        {activeTab === "export" && (
          <div>
            <h2 style={{ color: isDark ? "#fff" : "#333" }}>
              Export Multi-Formats
            </h2>
            <p
              style={{
                color: isDark ? "#9ca3af" : "#6b7280",
                marginBottom: "20px",
              }}
            >
              Choisissez le format d'export pour votre document Markdown.
            </p>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={textareaStyle}
              placeholder="Entrez votre contenu Markdown ici..."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
              }}
            >
              <button
                onClick={() => handleExport("pdf")}
                style={buttonStyle}
                disabled={exportMutation.isPending}
              >
                <DocumentArrowDownIcon
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "8px",
                  }}
                />
                Export PDF
              </button>

              <button
                onClick={() => handleExport("html")}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#8b5cf6",
                }}
                disabled={exportMutation.isPending}
              >
                <GlobeAltIcon
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "8px",
                  }}
                />
                Export HTML
              </button>

              <button
                onClick={() => handleExport("md")}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#10b981",
                }}
                disabled={exportMutation.isPending}
              >
                <DocumentTextIcon
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "8px",
                  }}
                />
                Export MD
              </button>
            </div>

            {exportMutation.isError && (
              <p style={{ color: "#ef4444", marginTop: "10px" }}>
                Erreur: {(exportMutation.error as Error).message}
              </p>
            )}

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "14px",
                color: isDark ? "#d1d5db" : "#4b5563",
              }}
            >
              <ChartBarIcon
                style={{
                  width: "16px",
                  height: "16px",
                  marginRight: "6px",
                  verticalAlign: "middle",
                }}
              />
              <strong>Statistiques :</strong>{" "}
              {content.split(/\s+/).filter((w) => w.length > 0).length} mots
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
