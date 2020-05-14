import { Observable, Computed } from "@residualeffect/reactor";

export interface LoadableBase {
	IsLoading: Observable<boolean>;
	ErrorMessage: Observable<string|null>;
	HasLoaded: Computed<boolean>;
}

export class Loadable<TSuccessData> implements LoadableBase {
	constructor() {
		this.IsLoading = new Observable(false);
		this.ErrorMessage = new Observable(null);
		this.SuccessData = new Observable(null);
		this.HasLoaded = new Computed(() => !this.IsLoading.Value && this.SuccessData.Value !== null);
	}

	public StartLoading(): Loadable<TSuccessData> {
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