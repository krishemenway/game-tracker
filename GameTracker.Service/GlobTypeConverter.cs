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

		public override bool CanConvertTo(ITypeDescriptorContext context, Type destinationType)
		{
			if (destinationType == typeof(string))
			{
				return true;
			}

			return base.CanConvertTo(context, destinationType);
		}

		public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType)
		{
			if (value is Glob valueAsGlob)
			{
				if (destinationType == typeof(string))
				{
					return valueAsGlob.ToString();
				}
			}
			else
			{
				throw new InvalidOperationException("Expected source type to be Glob");
			}

			return base.ConvertTo(context, culture, value, destinationType);
		}
	}
}
