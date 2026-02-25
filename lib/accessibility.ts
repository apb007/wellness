// WCAG 2.1 AA Accessibility Utilities

export const accessibilityChecklist = {
  colorContrast: [
    '✓ All text has minimum 4.5:1 contrast ratio for normal text',
    '✓ Large text (18pt+) has minimum 3:1 contrast ratio',
    '✓ Color not used as only means to convey information',
  ],
  structure: [
    '✓ Proper heading hierarchy (h1, h2, h3, etc.)',
    '✓ Semantic HTML (nav, main, aside, etc.)',
    '✓ Form labels associated with inputs',
  ],
  interactivity: [
    '✓ Keyboard navigation fully functional',
    '✓ Focus indicators clearly visible',
    '✓ Skip links for navigation',
    '✓ All buttons and links have descriptive text',
  ],
  media: [
    '✓ Images have descriptive alt text',
    '✓ Videos have captions',
    '✓ Audio has transcripts',
  ],
  responsiveness: [
    '✓ Works on mobile, tablet, desktop',
    '✓ Zoom up to 200% without loss of functionality',
    '✓ Text resizable up to 200%',
  ],
}

export function getAriaLabel(context: string): string {
  const labels: Record<string, string> = {
    wellness_score: 'Overall wellness score calculation',
    risk_alert: 'Risk alert notification',
    class_selection: 'Select your class level',
    assessment_form: 'Wellness assessment form with questions',
  }
  return labels[context] || context
}

export const a11yTips = [
  'Always use semantic HTML tags',
  'Provide alt text for all images',
  'Use ARIA labels for complex components',
  'Ensure keyboard navigation is fully functional',
  'Test with screen readers (NVDA, JAWS)',
  'Check color contrast ratios (use WebAIM)',
  'Test with zoom and text resizing',
]
