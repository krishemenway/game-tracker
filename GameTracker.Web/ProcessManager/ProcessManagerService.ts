import { Observable } from "@residualeffect/reactor";
import { ObservedProcess } from "ProcessManager/ObservedProcess";
import { Http } from "Common/Http";
import { Loadable } from "Common/Loadable";

interface ObservedProcessesResponse {
	ObservedProcesses: ObservedProcess[];
}

export class ObservableProcess {
	constructor(process: ObservedProcess) {
		this.Ignore = new Observable<boolean>(process.Ignore);
		this.ProcessPath = process.ProcessPath;
	}

	public Ignore: Observable<boolean>;
	public ProcessPath: string;
}

export class ProcessManagerService {
	constructor() {
		this.LoadingObservable = new Loadable<ObservableProcess[]>("Something went wrong loading observed processes from the server. Can only view this tool on the device running the service.");
		this.ToggleIgnoredErrorMessage = new Observable(null);
	}

	public ReloadProcesses(): void {
		Http.get<ObservedProcessesResponse, ObservableProcess[]>("/WebAPI/FindAllObservedProcesses", this.LoadingObservable, this.ConvertObservedProcessesResponse);
	}

	public OnToggleIgnored(observableProcess: ObservableProcess, ignore: boolean): void {
		Http.post("/WebAPI/ToggleIgnorePath", { FilePath: observableProcess.ProcessPath, Ignore: ignore })
			.then((_) => { observableProcess.Ignore.Value = ignore; })
			.catch((_) => { this.ToggleIgnoredErrorMessage.Value = `Failed to toggle ignore status for: ${observableProcess.ProcessPath}`; });
	}

	public LoadingObservable: Loadable<ObservableProcess[]>;
	public ToggleIgnoredErrorMessage: Observable<string|null>

	private ConvertObservedProcessesResponse(response: ObservedProcessesResponse): ObservableProcess[] {
		return response.ObservedProcesses.sort((a, b) => a.ProcessPath < b.ProcessPath ? -1 : 1).map((p) => new ObservableProcess(p));
	}

	static get Instance(): ProcessManagerService {
		if (this._instance === undefined) {
			this._instance = new ProcessManagerService();
		}

		return this._instance;
	}

	private static _instance: ProcessManagerService;
}
