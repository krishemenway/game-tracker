using GlobExpressions;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace GameTracker
{
	public class GlobJsonConverter : JsonConverter<Glob>
	{
		public override Glob Read(ref Utf8JsonReader reader, Type objectType, JsonSerializerOptions options)
		{
			return new Glob(reader.GetString());
		}

		public override void Write(Utf8JsonWriter writer, Glob value, JsonSerializerOptions options)
		{
			writer.WriteStringValue(value.Pattern);
		}
	}
}
