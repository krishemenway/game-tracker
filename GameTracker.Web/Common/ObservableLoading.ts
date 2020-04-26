import { Observable, Computed, ReadOnlyObservable } from "@residualeffect/reactor";

export class ObservableLoading<TSuccessData> {
	constructor() {
		this.IsLoading = new Observable(true);
		this.ErrorMessage = new Observable(null);
		this.SuccessData = new Observable(null);
	}

	public StartLoading(): void {
		this.IsLoading.Value = true;
	}

	public SucceededLoading(successData: TSuccessData): void {
		this.SuccessData.Value = successData;
		this.ErrorMessage.Value = null;
		this.IsLoading.Value = false;
	}

	public FailedLoading(errorMessage: string) {
		this.SuccessData.Value = null;
		this.ErrorMessage.Value = errorMessage;
		this.IsLoading.Value = false;
	}

	public IsLoading: Observable<boolean>;
	public ErrorMessage: Observable<string|null>;
	public SuccessData: Observable<TSuccessData|null>;
}