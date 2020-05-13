import { Observable, Computed } from "@residualeffect/reactor";

export interface ObservableLoading {
	IsLoading: Observable<boolean>;
	ErrorMessage: Observable<string|null>;
	HasLoaded: Computed<boolean>;
}

export class ObservableLoadingOf<TSuccessData> {
	constructor() {
		this.IsLoading = new Observable(true);
		this.ErrorMessage = new Observable(null);
		this.SuccessData = new Observable(null);
		this.HasLoaded = new Computed(() => this.SuccessData.Value !== null);
	}

	public StartLoading(): ObservableLoadingOf<TSuccessData> {
		this.IsLoading.Value = true;
		return this;
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

	public HasLoaded: Computed<boolean>;
}