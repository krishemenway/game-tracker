using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameTracker
{
	public static class DictionaryExtensions
	{
		public static Dictionary<TKey, TValue> SetDefaultValuesForKeys<TKey, TValue>(this Dictionary<TKey, TValue> existingDictionary, IEnumerable<TKey> keys, Func<TKey, TValue> getDefaultValue)
		{
			foreach(var key in keys)
			{
				existingDictionary.TryAdd(key, getDefaultValue(key));
			}

			return existingDictionary;
		}
	}
}
