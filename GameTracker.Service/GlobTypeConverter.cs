using GlobExpressions;
using System;
using System.ComponentModel;
using System.Globalization;

namespace GameTracker
{
	public class GlobTypeConverter : TypeConverter
	{
		public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
		{
			if (sourceType == typeof(string))
			{
				return true;
			}

			return base.CanConvertFrom(context, sourceType);
		}

		public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
		{
			if (value is string valueAsString)
			{
				return new Glob(valueAsString.Replace("/", "\\"));
			}

			return base.ConvertFrom(context, culture, value);
		}
	}
}
