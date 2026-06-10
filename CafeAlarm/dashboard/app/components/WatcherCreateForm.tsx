"use client";

import {
  BellRing,
  Link2,
  Save,
  SlidersHorizontal,
  TestTubeDiagonal,
  X,
} from "lucide-react";
import { useState } from "react";
import { CreateWatcherInput } from "../types/watcher";

type FormErrors = Partial<Record<keyof CreateWatcherInput, string>>;

export function WatcherCreateForm({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (input: CreateWatcherInput) => Promise<void>;
}) {
  const [form, setForm] = useState<CreateWatcherInput>({
    name: "",
    naverCafeUrl: "",
    discordWebhookUrl: "",
    pollIntervalSeconds: 60,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof CreateWatcherInput;

    setForm((previous) => ({
      ...previous,
      [name]: name === "pollIntervalSeconds" ? Number(value) : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [fieldName]: undefined,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "감시 대상 이름을 입력해주세요.";
    }

    if (!form.naverCafeUrl.trim()) {
      nextErrors.naverCafeUrl = "네이버 카페 URL을 입력해주세요.";
    }

    if (!form.discordWebhookUrl.trim()) {
      nextErrors.discordWebhookUrl = "Discord 웹훅 URL을 입력해주세요.";
    }

    if (
      !Number.isFinite(form.pollIntervalSeconds) ||
      form.pollIntervalSeconds < 60
    ) {
      nextErrors.pollIntervalSeconds = "확인 주기는 60초 이상이어야 합니다.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");
      await onCreate(form);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "감시 대상 생성에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-labelledby="create-watcher-title"
        aria-modal="true"
        className="create-modal"
        role="dialog"
      >
        <div className="modal-header">
          <div>
            <h2 id="create-watcher-title">새 감시 대상</h2>
            <p>네이버 카페와 Discord 웹훅을 연결합니다.</p>
          </div>
          <button
            aria-label="등록 취소"
            className="icon-button"
            onClick={onCancel}
            title="등록 취소"
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <form className="create-modal-form" onSubmit={handleSubmit}>
          <FormSection
            icon={<BellRing aria-hidden="true" size={15} />}
            title="기본 정보"
          >
            <FormField
              error={errors.name}
              label="감시 대상 이름"
              name="name"
              onChange={handleChange}
              placeholder="예: 네이버 공식 공지"
              value={form.name}
            />
          </FormSection>

          <FormSection
            icon={<Link2 aria-hidden="true" size={15} />}
            title="연결 정보"
          >
            <FormField
              error={errors.naverCafeUrl}
              label="네이버 카페 URL"
              name="naverCafeUrl"
              onChange={handleChange}
              placeholder="https://apis.naver.com/..."
              type="url"
              value={form.naverCafeUrl}
            />
            <FormField
              error={errors.discordWebhookUrl}
              label="Discord 웹훅 URL"
              name="discordWebhookUrl"
              onChange={handleChange}
              placeholder="https://discord.com/api/webhooks/..."
              type="url"
              value={form.discordWebhookUrl}
            />
          </FormSection>

          <FormSection
            icon={<SlidersHorizontal aria-hidden="true" size={15} />}
            title="실행 설정"
          >
            <label className="form-field">
              <span className="form-label">확인 주기</span>
              <span className="number-input-row">
                <input
                  aria-invalid={Boolean(errors.pollIntervalSeconds)}
                  className="form-input number-input"
                  min={60}
                  name="pollIntervalSeconds"
                  onChange={handleChange}
                  type="number"
                  value={form.pollIntervalSeconds}
                />
                <span className="input-unit">초</span>
              </span>
              {errors.pollIntervalSeconds && (
                <span className="form-error">{errors.pollIntervalSeconds}</span>
              )}
            </label>
          </FormSection>

          <div className="modal-actions">
            <button className="secondary-button" type="button">
              <TestTubeDiagonal aria-hidden="true" size={16} />
              연결 테스트
            </button>
            <div className="modal-actions-right">
              <button
                className="secondary-button"
                disabled={isSubmitting}
                onClick={onCancel}
                type="button"
              >
                취소
              </button>
              <button
                className="primary-button"
                disabled={isSubmitting}
                type="submit"
              >
                <Save aria-hidden="true" size={16} />
                {isSubmitting ? "등록 중..." : "감시 시작"}
              </button>
            </div>
          </div>
          {submitError && <p className="submit-error">{submitError}</p>}
        </form>
      </section>
    </div>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="modal-form-section">
      <div className="section-heading">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="form-section-fields">{children}</div>
    </section>
  );
}

function FormField({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: "text" | "url";
}) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <input
        aria-invalid={Boolean(error)}
        className="form-input"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
