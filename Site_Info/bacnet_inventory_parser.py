try:
        # Generate summary report
        print("\nGenerating summary report...")
        report_path = None
        try:
            report_path = generate_summary_report(results, output_dir, jace_name)
        except Exception as e:
            print(f"Error generating summary report: {str(e)}")
            import traceback
            traceback.print_exc()