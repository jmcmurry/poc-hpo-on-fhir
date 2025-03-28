package org.octri.hpoonfhir.view;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Stream;

import org.monarchinitiative.fhir2hpo.hpo.HpoTermWithNegation;
import org.monarchinitiative.phenol.ontology.data.Term;

/**
 * The model representing the fields on the phenotype that will be displayed.
 * 
 * @author yateam
 *
 */
public class PhenotypeModel implements Serializable {
	
	private static final long serialVersionUID = 5911092102035916719L;

	private final String hpoTermName;
	private final String hpoTermId;
	private final String first;
	private final String last;
	private final List<ObservationModel> observations;
	
	public PhenotypeModel(HpoTermWithNegation hpoTerm, Term termInfo, List<ObservationModel> observations) {
		this.hpoTermName = constructTermName(hpoTerm, termInfo);
		this.hpoTermId = hpoTerm.getHpoTermId().getIdWithPrefix();
		this.observations = observations;
		// Get the earliest/latest start or end date
		this.first = observations.stream().flatMap(o -> Stream.of(o.getStartDate(), o.getEndDate())).filter(s -> !s.isEmpty()).min(String::compareTo).get();
		this.last = observations.stream().flatMap(o -> Stream.of(o.getStartDate(), o.getEndDate())).filter(s -> !s.isEmpty()).max(String::compareTo).get();
	}

	private String constructTermName(HpoTermWithNegation hpoTerm, Term termInfo) {
		if (termInfo != null) {
			return (hpoTerm.isNegated()?"NOT ":"") + termInfo.getName();
		}
		
		// Tests in the fhir2hpo library should prevent a null termInfo, but just in case
		return "Unrecognized HPO Term Id";
	}

	public String getHpoTermName() {
		return hpoTermName;
	}
	
	public String getHpoTermId() {
		return hpoTermId;
	}

	public String getFirst() {
		return first;
	}
	
	public String getLast() {
		return last;
	}
	
	public List<ObservationModel> getObservations() {
		return observations;
	}
	
	public Integer getCount() {
		return observations.size();
	}

}
