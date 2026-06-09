export const DetailRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className={mono ? "detail-value detail-mono" : "detail-value"}>
        {value}
      </span>
    </div>
  );
};
