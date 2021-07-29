package io.swagger.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.model.OCRRequest;
import io.swagger.model.OCRResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * OCRInference
 */
@Validated
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2021-07-26T10:42:04.802Z[GMT]")


public class OCRInference  implements OneOfInferenceAPIEndPointSchema {
  /**
   * Gets or Sets name
   */
  public enum NameEnum {
    OCRINFERENCE("OCRInference");

    private String value;

    NameEnum(String value) {
      this.value = value;
    }

    @Override
    @JsonValue
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static NameEnum fromValue(String text) {
      for (NameEnum b : NameEnum.values()) {
        if (String.valueOf(b.value).equals(text)) {
          return b;
        }
      }
      return null;
    }
  }
  @JsonProperty("name")
  private NameEnum name = null;

  @JsonProperty("request")
  private OCRRequest request = null;

  @JsonProperty("response")
  private OCRResponse response = null;

  public OCRInference name(NameEnum name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   **/
  @Schema(required = true, description = "")
      @NotNull

    public NameEnum getName() {
    return name;
  }

  public void setName(NameEnum name) {
    this.name = name;
  }

  public OCRInference request(OCRRequest request) {
    this.request = request;
    return this;
  }

  /**
   * Get request
   * @return request
   **/
  @Schema(required = true, description = "")
      @NotNull

    @Valid
    public OCRRequest getRequest() {
    return request;
  }

  public void setRequest(OCRRequest request) {
    this.request = request;
  }

  public OCRInference response(OCRResponse response) {
    this.response = response;
    return this;
  }

  /**
   * Get response
   * @return response
   **/
  @Schema(description = "")
  
    @Valid
    public OCRResponse getResponse() {
    return response;
  }

  public void setResponse(OCRResponse response) {
    this.response = response;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    OCRInference ocRInference = (OCRInference) o;
    return Objects.equals(this.name, ocRInference.name) &&
        Objects.equals(this.request, ocRInference.request) &&
        Objects.equals(this.response, ocRInference.response);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, request, response);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class OCRInference {\n");
    
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    request: ").append(toIndentedString(request)).append("\n");
    sb.append("    response: ").append(toIndentedString(response)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}