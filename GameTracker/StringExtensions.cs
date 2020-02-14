using System;
using System.Collections.Generic;
using System.Linq;

namespace GameTracker
{
	public static class StringExtensions
	{
		public static bool StartsWithAny(this string valueToBeCompared, IEnumerable<string> startsWithValues, StringComparison stringComparison)
		{
			return startsWithValues.Any(startsWithValue => valueToBeCompared.StartsWith(startsWithValue, stringComparison));
		}
	}
}
