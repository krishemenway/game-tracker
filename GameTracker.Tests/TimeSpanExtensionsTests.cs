using FluentAssertions;
using NUnit.Framework;
using System;

namespace GameTracker.Tests
{
	[TestFixture]
	public class TimeSpanExtensionsTests
	{
		[Test]
		public void ShouldReturn0SecondsWhenLessThanOneSecond()
		{
			TimeSpan.FromMilliseconds(1).HumanReadable().Should().Be("0 seconds");
			TimeSpan.FromMilliseconds(999).HumanReadable().Should().Be("0 seconds");
		}

		[Test]
		public void ShouldReturnTimeSpanInSecondsWhenLessThanMaximumSecondsValue()
		{
			TimeSpan.FromSeconds(1).HumanReadable().Should().Be("1 second");
			TimeSpan.FromMilliseconds(1500).HumanReadable().Should().Be("1 second");

			TimeSpan.FromSeconds(25).HumanReadable().Should().Be("25 seconds");
			TimeSpan.FromSeconds(TimeSpanExtensions.MaximumSecondsValue - 1).HumanReadable().Should().Be($"{TimeSpanExtensions.MaximumSecondsValue - 1} seconds");
		}
	}
}
