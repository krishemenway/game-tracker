using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using System;
using StringId = StronglyTyped.StringIds;
using GuidId = StronglyTyped.GuidIds;

namespace GameTracker
{
	public class GuidIdTypeConverter<T> : DefaultTypeConverter
	{
		public override object ConvertFromString(string text, IReaderRow row, MemberMapData memberMapData)
		{
			return new GuidId.Id<T>(Guid.Parse(text));
		}
	}

	public class StringIdTypeConverter<T> : DefaultTypeConverter
	{
		public override object ConvertFromString(string text, IReaderRow row, MemberMapData memberMapData)
		{
			return new StringId.Id<T>(text);
		}
	}
}
