using GameTracker.Games;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace GameTracker.ControlPanel
{
	[Route("WebAPI/ControlPanel")]
	[RestrictToLocalhost]
	public class ReloadGamesMetadataController : ControllerBase
	{
		[HttpPost(nameof(ReloadGames))]
		public async Task<ActionResult<ReloadGamesMetadataResponse>> ReloadGames()
		{
			await new GameStore().ReloadGamesFromCentralRepository();
			return new ReloadGamesMetadataResponse { Success = true };
		}
	}

	public class ReloadGamesMetadataResponse
	{
		public bool Success { get; set; }
	}
}
