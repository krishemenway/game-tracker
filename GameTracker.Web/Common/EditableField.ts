import { Computed, Observable } from "@residualeffect/reactor";
import { Coalesce } from "Common/Strings";

export class EditableField {
	constructor(fieldId: string, defaultValue?: string, canMakeRequestFunc?: () => string, beforeChange?: (newValue: string) => string) {
		this.FieldId = fieldId;
		this.CanMakeRequestFunc = canMakeRequestFunc ?? (() => "");
		this.BeforeChange = beforeChange ?? ((newValue) => newValue);

		this.Saved = new Observable<string>(defaultValue ?? "");
		this.Current = new Observable<string>(this.Saved.Value);
		this.HasChanged = new Computed(() => this.Current !== this.Saved);
		this.ServerErrorMessage = new Observable<string>("");

		this.ErrorMessage = new Computed<string>(() => Coalesce([this.CanMakeRequestFunc(), this.ServerErrorMessage.Value]));
	}

	public OnChange(newValue: string) {
		this.Current.Value = this.BeforeChange(newValue);
	}

	public OnSaved(): void {
		this.Saved.Value = this.Current.Value;
	}

	public FieldId: string;
	public CanMakeRequestFunc: () => string;
	public BeforeChange: (newValue: string) => string;

	public Current: Observable<string>;
	public Saved: Observable<string>;
	public HasChanged: Computed<boolean>;
	public ServerErrorMessage: Observable<string>;

	public ErrorMessage: Computed<string>;
}
