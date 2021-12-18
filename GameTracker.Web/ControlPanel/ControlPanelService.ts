import { Observable, ObservableArray } from "@residualeffect/reactor";
import { Http } from "Common/Http";
import { Loadable } from "Common/Loadable";
import { EditableField } from "Common/EditableField";
import { UserProfileTheme } from "UserProfile/UserProfileTheme";

interface ControlPanelStatusResponse {
	ObservedProcesses: ObservedProcess[];
	RunningProcesses: RunningProcess[];
	RecentProcesses: ProcessSession[];

	UserName: string;
	Email: string;
	Theme: UserProfileTheme;
	WebPort: number;
	GamesUrl: string;
	ProcessScanIntervalInSeconds: number;
	StartsWithExclusions: string[];
	ProcessNameExclusions: string[];
}

export interface ProcessSession {
	ProcessSessionId: string;
	FilePath: string;
	StartTime: string;
	EndTime: string;
}

export interface RunningProcess {
	ProcessName: string;
	StartTime: string;
	FilePath: string;
}

export interface ObservedProcess {
	ProcessName: string;
	ProcessPath: string;
	Ignore: boolean;
}

export class ModifiableObservedProcess {
	constructor(process: ObservedProcess) {
		this.Ignore = new Observable<boolean>(process.Ignore);
		this.ProcessPath = process.ProcessPath;
	}

	public Ignore: Observable<boolean>;
	public ProcessPath: string;
}

export class ControlPanelSettings {
	constructor(response: ControlPanelStatusResponse) {
		this.UserName = new EditableField("UserName", response.UserName);
		this.Email = new EditableField("Email", response.Email);
		this.WebPort = new EditableField("WebPort", response.WebPort.toString());
		this.GamesUrl = new EditableField("GamesUrl", response.GamesUrl);
		this.ProcessScanIntervalInSeconds = new EditableField("ProcessScanIntervalInSeconds", response.ProcessScanIntervalInSeconds.toString());
		this.AllObservedProcesses = new ObservableArray<ModifiableObservedProcess>(response.ObservedProcesses.sort((a, b) => a.ProcessPath < b.ProcessPath ? -1 : 1).map((p) => new ModifiableObservedProcess(p)));
	}

	public UserName: EditableField;
	public Email: EditableField;
	public WebPort: EditableField;
	public GamesUrl: EditableField;
	public ProcessScanIntervalInSeconds: EditableField;
	public AllObservedProcesses: ObservableArray<ModifiableObservedProcess>;
}

export class ControlPanelService {
	constructor() {
		this.Status = new Loadable<ControlPanelSettings>("Something went wrong loading observed processes from the server. Can only view this tool on the device running the service.");
		this.ToggleIgnoredErrorMessage = new Observable(null);
	}

	public LoadStatus(): void {
		Http.get<ControlPanelStatusResponse, ControlPanelSettings>("/WebAPI/ControlPanel/Status", this.Status, (r) => new ControlPanelSettings(r));
	}

	public OnToggleIgnored(observableProcess: ModifiableObservedProcess, ignore: boolean): void {
		Http.post("/WebAPI/ToggleIgnorePath", { FilePath: observableProcess.ProcessPath, Ignore: ignore })
			.then((_) => { observableProcess.Ignore.Value = ignore; })
			.catch((_) => { this.ToggleIgnoredErrorMessage.Value = `Failed to toggle ignore status for: ${observableProcess.ProcessPath}`; });
	}

	public Status: Loadable<ControlPanelSettings>;
	public ToggleIgnoredErrorMessage: Observable<string|null>

	static get Instance(): ControlPanelService {
		if (this._instance === undefined) {
			this._instance = new ControlPanelService();
		}

		return this._instance;
	}

	private static _instance: ControlPanelService;
}
