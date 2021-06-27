export interface UserProfileTheme {
	PanelBackgroundColor: string;
	PageBackgroundColor: string;

	PrimaryTextColor: string;
	SecondaryTextColor: string;
}

class UserProfileThemeStore {
	public static CurrentTheme: UserProfileTheme;
}

export default UserProfileThemeStore;