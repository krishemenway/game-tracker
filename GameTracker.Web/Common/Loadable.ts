import { Observable, Computed, ReadOnlyObservable } from "@residualeffect/reactor";

export interface LoadableData<TSuccessData> {
	SuccessData: TSuccessData|null;
	ErrorMessage: string;
	State: LoadState;
}

export enum LoadState {
	NotStarted,
	Loading,
	Loaded,
	Failed,
	Unloaded,
}

export interface ILoadable<TSuccessData> {
	Data: ReadOnlyObservable<LoadableData<TSuccessData>>;

	CanMakeRequest(): boolean;

	StartLoading(): Loadable<TSuccessData>;
	SucceededLoading(successData: TSuccessData): void;
	FailedLoading(errorMessage: string): void;
	Reset(): void;
}

export class Loadable<TSuccessData> implements ILoadable<TSuccessData> {
	constructor(defaultErrorMessage?: string) {
		this._loadableData = new Observable(Loadable.NotStartedData);
		this._defaultErrorMessage = defaultErrorMessage ?? "Something went wrong making this request. Please try again later.";
	}

	public StartLoading(): Loadable<TSuccessData> {
		this._loadableData.Value = Loadable.LoadingData;
		return this;
	}

	public SucceededLoading(successData: TSuccessData): void {
		this._loadableData.Value = { SuccessData: successData, State: LoadState.Loaded, ErrorMessage: "" };
	}

	public FailedLoading(errorMessage: string): void {
		this._loadableData.Value = { SuccessData: null, State: LoadState.Failed, ErrorMessage: errorMessage.length === 0 ? this._defaultErrorMessage : errorMessage };
	}

	public Reset(): void {
		this._loadableData.Value = Loadable.UnloadedData;
	}

	public CanMakeRequest(): boolean {
		return this.Data.Value.State !== LoadState.Loading;
	}

	public get Data(): ReadOnlyObservable<LoadableData<TSuccessData>> { return this._loadableData; }

	private static NotStartedData = { SuccessData: null, State: LoadState.NotStarted, ErrorMessage: "" };
	private static LoadingData = { SuccessData: null, State: LoadState.Loading, ErrorMessage: "" };
	private static UnloadedData = { SuccessData: null, State: LoadState.Unloaded, ErrorMessage: "" };

	private _defaultErrorMessage: string;

	private _loadableData: Observable<LoadableData<TSuccessData>>;
}