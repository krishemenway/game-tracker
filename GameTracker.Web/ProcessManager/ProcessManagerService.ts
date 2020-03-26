import { Observable } from "@residualeffect/reactor";
import { ObservedProcess } from "ProcessManager/ObservedProcess";

interface ObservedProcessesResponse {
	ObservedProcesses: ObservedProcess[];
}

export class ObservableProcess {
	constructor(process: ObservedProcess) {
		console.log(process.Ignore);
		this.Ignore = new Observable<boolean>(process.Ignore);
		this.ProcessPath = process.ProcessPath;
	}

	public Ignore: Observable<boolean>;
	public ProcessPath: string;
}

export class ProcessManagerService {
	constructor() {
		this.CurrentObservedProcesses = new Observable<ObservableProcess[]>([]);
	}

	public ReloadProcesses(): void {
		fetch('/WebAPI/FindAllObservedProcesses')
			.then((response) => response.json())
			.then((data: ObservedProcessesResponse) => {
				// todo add sorting
				this.CurrentObservedProcesses.Value = data.ObservedProcesses.sort((a, b) => a.ProcessPath < b.ProcessPath ? -1 : 1).map((p) => new ObservableProcess(p));
			});
	}

	public OnToggleIgnored(observableProcess: ObservableProcess, ignore: boolean): void {
		fetch('/WebAPI/ToggleIgnorePath', { 
			body: JSON.stringify({ FilePath: observableProcess.ProcessPath, Ignore: ignore }),
			method: "post",
			headers: { "Content-Type": "application/json" },
		})
		.then(() => { observableProcess.Ignore.Value = ignore; });
	}

	public CurrentObservedProcesses: Observable<ObservableProcess[]>;

	static get Instance(): ProcessManagerService {
		if (this._instance === undefined) {
			this._instance = new ProcessManagerService();
		}

		return this._instance;
	}

	private static _instance: ProcessManagerService;
}
