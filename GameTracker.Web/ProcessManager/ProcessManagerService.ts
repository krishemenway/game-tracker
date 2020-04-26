import { Observable } from "@residualeffect/reactor";
import { ObservedProcess } from "ProcessManager/ObservedProcess";
import { Http } from "Common/Http";

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
		this.CurrentObservedProcesses = new Observable<ObservableProcess[]>([]);
		this.IsLoading = new Observable(true);
		this.LoadErrorMessage = new Observable(null);
		this.ToggleIgnoredErrorMessage = new Observable(null);
	}

	public ReloadProcesses(): void {
		Http.get<ObservedProcessesResponse>("/WebAPI/FindAllObservedProcesses")
			.then((response) => { this.CurrentObservedProcesses.Value = response.ObservedProcesses.sort((a, b) => a.ProcessPath < b.ProcessPath ? -1 : 1).map((p) => new ObservableProcess(p)); })
			.catch((_) => { this.LoadErrorMessage.Value = "Something went wrong loading observed processes from the server. Can only view this tool on the device running the service."; })
			.finally(() => { this.IsLoading.Value = false; });
	}

	public OnToggleIgnored(observableProcess: ObservableProcess, ignore: boolean): void {
		Http.post("/WebAPI/ToggleIgnorePath", { FilePath: observableProcess.ProcessPath, Ignore: ignore })
			.then((_) => { observableProcess.Ignore.Value = ignore; })
			.catch((_) => { this.ToggleIgnoredErrorMessage.Value = `Failed to toggle ignore status for: ${observableProcess.ProcessPath}`; });
	}

	public CurrentObservedProcesses: Observable<ObservableProcess[]>;
	public IsLoading: Observable<boolean>;
	public LoadErrorMessage: Observable<string|null>;
	public ToggleIgnoredErrorMessage: Observable<string|null>

	static get Instance(): ProcessManagerService {
		if (this._instance === undefined) {
			this._instance = new ProcessManagerService();
		}

		return this._instance;
	}

	private static _instance: ProcessManagerService;
}
