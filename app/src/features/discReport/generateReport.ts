import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { DiscReportPDF, type DiscReportData } from './DiscReportPDF';

/**
 * Fetches the most recent disc_result for a given email,
 * renders the PDF, and triggers a browser download.
 */
export async function generateDiscReport(
  respondentName: string,
  respondentEmail: string,
): Promise<void> {
  const { data, error } = await supabase
    .from('disc_results')
    .select('*')
    .eq('respondent_email', respondentEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new Error(error?.message ?? 'No DISC result found for this candidate.');
  }

  const reportData: DiscReportData = {
    respondent_name:   data.respondent_name,
    respondent_email:  data.respondent_email,
    scores:            data.scores,
    public_profile:    data.public_profile,
    public_label:      data.public_label,
    private_profile:   data.private_profile,
    private_label:     data.private_label,
    perceived_profile: data.perceived_profile,
    perceived_label:   data.perceived_label,
    alignment_type:    data.alignment_type,
    stress_scale:      data.stress_scale,
    created_at:        data.created_at,
  };

  const blob = await pdf(React.createElement(DiscReportPDF, { data: reportData })).toBlob();

  const url = URL.createObjectURL(blob);
  const tab = window.open(url, '_blank');
  // Revoke the object URL after the new tab has had time to load it
  if (tab) {
    tab.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
  }
}
