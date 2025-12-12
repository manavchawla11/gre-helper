export default function LocaleSelect({ locale, locales, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 14 }}>🌐</span>
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid #ddd',
          background: 'white',
        }}
        aria-label="Select language"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
