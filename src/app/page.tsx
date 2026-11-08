'use client';

import React, { useState, useEffect } from 'react';
import {
  AthleteDetails,
  CertificateTemplate,
  GeneratedCertificateRecord,
  NavigationTab,
  TemplateLayoutConfig,
} from '@/types';
import {
  getStoredTemplates,
  saveTemplate,
  deleteTemplate,
  renameTemplate,
  getStoredHistory,
  addHistoryRecord,
  clearHistoryRecords,
  getTemplateForCertificateType,
} from '@/lib/storage';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardOverview } from '@/components/DashboardOverview';
import { AthleteForm } from '@/components/AthleteForm';
import { CertificatePreview } from '@/components/CertificatePreview';
import { TemplateManager } from '@/components/TemplateManager';
import { CertificateHistory } from '@/components/CertificateHistory';
import { TemplateCalibrator } from '@/components/TemplateCalibrator';
import { BulkGenerator } from '@/components/BulkGenerator';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Storage states
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [history, setHistory] = useState<GeneratedCertificateRecord[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Active generation/preview workflow state
  const [activeAthlete, setActiveAthlete] = useState<AthleteDetails | null>(null);
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState<CertificateTemplate | null>(
    null
  );
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Calibrator state
  const [calibratingTemplate, setCalibratingTemplate] = useState<CertificateTemplate | null>(null);

  // Initialize client-side stored data
  useEffect(() => {
    setTemplates(getStoredTemplates());
    setHistory(getStoredHistory());
    setIsClientLoaded(true);
  }, []);

  // When single athlete form is submitted
  const handleAthleteFormSubmit = (details: AthleteDetails) => {
    const certNum =
      details.certificateNumber ||
      `KYX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullAthleteDetails: AthleteDetails = {
      ...details,
      certificateNumber: certNum,
      issueDate: new Date().toISOString(),
    };

    setActiveAthlete(fullAthleteDetails);

    // Find assigned template for this certificate type
    const assigned = getTemplateForCertificateType(fullAthleteDetails.certificateType);
    setSelectedPreviewTemplate(assigned);

    // Switch to preview mode
    setIsPreviewMode(true);
  };

  // When a certificate is downloaded / saved individually
  const handleCertificateGenerated = (
    athlete: AthleteDetails,
    template: CertificateTemplate | null
  ) => {
    const record: GeneratedCertificateRecord = {
      id: `cert-${Date.now()}`,
      certificateNumber: athlete.certificateNumber || `KYX-2026-${Date.now().toString().slice(-4)}`,
      athleteDetails: athlete,
      templateId: template?.id,
      templateName: template?.name,
      generatedAt: new Date().toISOString(),
    };

    const updatedHistory = addHistoryRecord(record);
    setHistory(updatedHistory);
  };

  // Phase 3: When a bulk batch completes
  const handleBatchCompleted = (batchRecords: GeneratedCertificateRecord[]) => {
    let currentHistory = getStoredHistory();
    for (const rec of batchRecords) {
      currentHistory = [rec, ...currentHistory];
    }
    if (currentHistory.length > 500) {
      currentHistory = currentHistory.slice(0, 500);
    }
    try {
      localStorage.setItem('kyorix_certificate_history_v1', JSON.stringify(currentHistory));
    } catch (e) {
      console.warn('LocalStorage limit reached when saving batch history', e);
    }
    setHistory(currentHistory);
  };

  // Phase 3: Preview athlete from bulk table
  const handlePreviewAthleteFromBulk = (
    athlete: AthleteDetails,
    template: CertificateTemplate | null
  ) => {
    setActiveAthlete(athlete);
    setSelectedPreviewTemplate(template);
    setCurrentTab('generate');
    setIsPreviewMode(true);
  };

  // Template management actions
  const handleSaveTemplate = (template: CertificateTemplate) => {
    const updated = saveTemplate(template);
    setTemplates(updated);
    if (selectedPreviewTemplate?.id === template.id) {
      setSelectedPreviewTemplate(template);
    }
  };

  const handleRenameTemplate = (id: string, newName: string) => {
    const updated = renameTemplate(id, newName);
    setTemplates(updated);
    if (selectedPreviewTemplate?.id === id) {
      setSelectedPreviewTemplate(prev => (prev ? { ...prev, name: newName } : null));
    }
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = deleteTemplate(id);
    setTemplates(updated);
  };

  // Phase 2: Save Calibrated Layout Configuration
  const handleSaveTemplateLayout = (templateId: string, layout: TemplateLayoutConfig) => {
    const target = templates.find(t => t.id === templateId);
    if (!target) return;

    const updatedTemplate: CertificateTemplate = {
      ...target,
      layoutConfig: layout,
    };

    const updatedList = saveTemplate(updatedTemplate);
    setTemplates(updatedList);

    if (selectedPreviewTemplate?.id === templateId) {
      setSelectedPreviewTemplate(updatedTemplate);
    }
  };

  // History table view action -> load directly into preview
  const handleViewRecordFromHistory = (record: GeneratedCertificateRecord) => {
    setActiveAthlete(record.athleteDetails);
    const matchedTemplate =
      templates.find(t => t.id === record.templateId) ||
      getTemplateForCertificateType(record.athleteDetails.certificateType);
    setSelectedPreviewTemplate(matchedTemplate);
    setCurrentTab('generate');
    setIsPreviewMode(true);
  };

  const handleClearHistory = () => {
    clearHistoryRecords();
    setHistory([]);
  };

  // Templates eligible for the active athlete's certificate type
  const eligibleTemplates = activeAthlete
    ? templates.filter(t => t.assignedTypes.includes(activeAthlete.certificateType))
    : templates;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={tab => {
          setCurrentTab(tab);
          if (tab !== 'generate') {
            setIsPreviewMode(false);
          }
        }}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen">
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onQuickGenerate={() => {
            setCurrentTab('generate');
            setIsPreviewMode(false);
          }}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {!isClientLoaded ? (
            <div className="h-96 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-cyan-600 font-bold">Loading Kyorix Engine...</p>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD */}
              {currentTab === 'dashboard' && (
                <DashboardOverview
                  templates={templates}
                  history={history}
                  onNavigate={tab => {
                    setCurrentTab(tab);
                    if (tab === 'generate') {
                      setIsPreviewMode(false);
                    }
                  }}
                  onSelectRecentRecord={handleViewRecordFromHistory}
                />
              )}

              {/* TAB 2: GENERATE SINGLE CERTIFICATE & PREVIEW */}
              {currentTab === 'generate' && (
                <div>
                  {!isPreviewMode ? (
                    <div className="max-w-4xl mx-auto">
                      <AthleteForm
                        initialValues={activeAthlete || undefined}
                        onSubmit={handleAthleteFormSubmit}
                      />
                    </div>
                  ) : activeAthlete ? (
                    <div className="space-y-4">
                      <CertificatePreview
                        athlete={activeAthlete}
                        template={selectedPreviewTemplate}
                        availableTemplates={eligibleTemplates}
                        onSelectTemplate={t => setSelectedPreviewTemplate(t)}
                        onCertificateGenerated={handleCertificateGenerated}
                        onBackToEdit={() => setIsPreviewMode(false)}
                        onOpenCalibrator={t => setCalibratingTemplate(t)}
                      />
                    </div>
                  ) : null}
                </div>
              )}

              {/* TAB 3: BULK GENERATION & EXCEL IMPORT */}
              {currentTab === 'bulk' && (
                <div className="max-w-6xl mx-auto">
                  <BulkGenerator
                    templates={templates}
                    onBatchCompleted={handleBatchCompleted}
                    onPreviewAthlete={handlePreviewAthleteFromBulk}
                  />
                </div>
              )}

              {/* TAB 4: MANAGE TEMPLATES (PHASE 4 ENHANCED) */}
              {currentTab === 'templates' && (
                <div className="max-w-6xl mx-auto">
                  <TemplateManager
                    templates={templates}
                    onSaveTemplate={handleSaveTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    onOpenCalibrator={t => setCalibratingTemplate(t)}
                    onRenameTemplate={handleRenameTemplate}
                  />
                </div>
              )}

              {/* TAB 5: CERTIFICATE HISTORY */}
              {currentTab === 'history' && (
                <div className="max-w-6xl mx-auto">
                  <CertificateHistory
                    history={history}
                    onViewRecord={handleViewRecordFromHistory}
                    onClearHistory={handleClearHistory}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* PHASE 2 & 4 CALIBRATOR MODAL */}
      {calibratingTemplate && (
        <TemplateCalibrator
          initialTemplate={calibratingTemplate}
          allTemplates={templates}
          onSaveLayout={handleSaveTemplateLayout}
          onClose={() => setCalibratingTemplate(null)}
          sampleAthlete={activeAthlete || undefined}
        />
      )}
    </div>
  );
}
