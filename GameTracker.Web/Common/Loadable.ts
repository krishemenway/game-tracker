import { Observable, Computed, ReadOnlyObservable } from "@residualeffect/reactor";

export interface LoadableBase {
	IsLoading: ReadOnlyObservable<boolean>;
	ErrorMessage: ReadOnlyObservable<string|null>;
	HasLoaded: ReadOnlyObservable<boolean>;
}

export class Loadable<TSuccessData> implements LoadableBase {
	constructor() {
		this._isLoading = new Observable(false);
		this._errorMessage = new Observable(null);
		this._successData = new Observable(null);
		this._hasLoaded = new Computed(() => this.SuccessData.Value !== null);
	}

	public StartLoading(): Loadable<TSuccessData> {
		this._successData.Value = null;
		this._errorMessage.Value = null;
		this._isLoading.Value = true;
		return this;
	}

	public SucceededLoading(successData: TSuccessData): void {
		this._successData.Value = successData;
		this._errorMessage.Value = null;
		this._isLoading.Value = false;
	}

	public FailedLoading(errorMessage: string): void {
		this._successData.Value = null;
		this._errorMessage.Value = errorMessage;
		this._isLoading.Value = false;
	}

	public get IsLoading(): ReadOnlyObservable<boolean> { return this._isLoading; }
	public get ErrorMessage(): ReadOnlyObservable<string|null>  { return this._errorMessage; }
	public get SuccessData(): ReadOnlyObservable<TSuccessData|null>  { return this._successData; }
	public get HasLoaded(): ReadOnlyObservable<boolean> { return this._hasLoaded; }

	private _isLoading: Observable<boolean>;
	private _errorMessage: Observable<string|null>;
	private _successData: Observable<TSuccessData|null>;
	private _hasLoaded: Computed<boolean>;
}