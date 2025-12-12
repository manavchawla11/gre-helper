export default function LocaleSelect({ locale, locales, onChange }) {
  return (
    <div
      className="pill"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
      }}
    >
      <span
        aria-hidden
        style={{
          fontSize: 14,
          opacity: 0.75,
        }}
      >
        🌐
      </span>

      <select
        className="select"
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select language"
        style={{
          border: 'none',
          padding: '6px 6px',
          background: 'transparent',
        }}
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
