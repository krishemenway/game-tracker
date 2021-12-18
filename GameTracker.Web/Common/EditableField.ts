import { Computed, Observable } from "@residualeffect/reactor";
import { Coalesce } from "Common/Strings";

export class EditableField {
	constructor(fieldId: string, defaultValue?: string, canMakeRequestFunc?: () => string) {
		this.FieldId = fieldId;
		this.CanMakeRequestFunc = canMakeRequestFunc ?? (() => "");

		this.Data = new Observable<string>(defaultValue ?? "");
		this.ServerErrorMessage = new Observable<string>("");

		this.ErrorMessage = new Computed<string>(() => Coalesce([this.CanMakeRequestFunc(), this.ServerErrorMessage.Value]));
	}

	public FieldId: string;
	public CanMakeRequestFunc: () => string;

	public Data: Observable<string>;
	public ServerErrorMessage: Observable<string>;

	public ErrorMessage: Computed<string>;
}
