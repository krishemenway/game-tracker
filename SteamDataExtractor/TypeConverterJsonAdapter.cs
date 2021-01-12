using System;
using System.ComponentModel;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SteamDataExtractor
{
	/// <summary>
	/// Adapter between <see cref="System.ComponentModel.TypeConverter"/> 
	/// and <see cref="JsonConverter"/>
	/// </summary>
	public class TypeConverterJsonAdapter : JsonConverter<object>
	{
		public override object Read(
			ref Utf8JsonReader reader,
			Type typeToConvert,
			JsonSerializerOptions options)
		{

			var converter = TypeDescriptor.GetConverter(typeToConvert);
			var text = reader.GetString();
			return converter.ConvertFromString(text);
		}

		public override void Write(
			Utf8JsonWriter writer,
			object objectToWrite,
			JsonSerializerOptions options)
		{

			var converter = TypeDescriptor.GetConverter(objectToWrite);
			var text = converter.ConvertToString(objectToWrite);
			writer.WriteStringValue(text);
		}

		public override bool CanConvert(Type typeToConvert)
		{
			return TypeDescriptor.GetAttributes(typeToConvert).OfType<TypeConverterAttribute>().Any();
		}
	}
}
